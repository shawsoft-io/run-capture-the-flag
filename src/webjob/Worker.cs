using Azure.Storage.Queues;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using RestSharp;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

public class StravaEventWorker : BackgroundService
{
    private readonly ILogger<StravaEventWorker> _logger;
    private readonly QueueClient _queueClient;
    private readonly IMongoCollection<BsonDocument> _mongoCollection;
    private readonly RestClient _stravaClient;

    public StravaEventWorker(ILogger<StravaEventWorker> logger)
    {
        _logger = logger;

        // Initialize Azure Queue Client
        string queueConnectionString = "YOUR_AZURE_QUEUE_CONNECTION_STRING";
        string queueName = "strava-events";
        _queueClient = new QueueClient(queueConnectionString, queueName);

        // Initialize MongoDB Client
        var mongoClient = new MongoClient("YOUR_MONGODB_CONNECTION_STRING");
        var mongoDatabase = mongoClient.GetDatabase("StravaDB");
        _mongoCollection = mongoDatabase.GetCollection<BsonDocument>("events");

        // Initialize Strava API Client
        _stravaClient = new RestClient("https://www.strava.com/api/v3");
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Worker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            // Receive message from Azure Queue
            var message = await _queueClient.ReceiveMessageAsync(cancellationToken: stoppingToken);
            if (message.Value != null)
            {
                _logger.LogInformation("Message received from queue.");

                try
                {
                    // Process the message
                    var eventId = JsonSerializer.Deserialize<string>(message.Value.MessageText);
                    await ProcessEvent(eventId);

                    // Delete the message from the queue
                    await _queueClient.DeleteMessageAsync(message.Value.MessageId, message.Value.PopReceipt, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error processing message: {ex.Message}");
                }
            }

            await Task.Delay(1000, stoppingToken); // Polling interval
        }
    }

    private async Task ProcessEvent(string eventId)
    {
        _logger.LogInformation($"Processing event ID: {eventId}");

        // Fetch access token (assuming a static token for simplicity)
        string accessToken = "YOUR_STRAVA_ACCESS_TOKEN";

        // Fetch event details from Strava API
        var request = new RestRequest($"activities/{eventId}", Method.Get);
        request.AddHeader("Authorization", $"Bearer {accessToken}");
        var response = await _stravaClient.ExecuteAsync(request);

        if (!response.IsSuccessful)
        {
            _logger.LogError($"Error fetching event details from Strava API: {response.ErrorMessage}");
            return;
        }

        // Parse the response
        var eventDetails = JsonSerializer.Deserialize<StravaEvent>(response.Content);

        // Save the event details to MongoDB
        var bsonDocument = eventDetails.ToBsonDocument();
        await _mongoCollection.InsertOneAsync(bsonDocument);

        _logger.LogInformation("Event details saved to MongoDB.");
    }
}

// Strava event model
public class StravaEvent
{
    [JsonPropertyName("id")]
    public string Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; }

    [JsonPropertyName("distance")]
    public float Distance { get; set; }

    [JsonPropertyName("moving_time")]
    public int MovingTime { get; set; }

    [JsonPropertyName("elapsed_time")]
    public int ElapsedTime { get; set; }

    [JsonPropertyName("start_date")]
    public string StartDate { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; }
}