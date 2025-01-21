using RestSharp;
using System;
using System.Text.Json;
using System.Threading.Tasks;

public class StravaTokenManager
{
    private readonly string _clientId;
    private readonly string _clientSecret;
    private string _refreshToken
    private string _accessToken;
    private DateTime _accessTokenExpiresAt;

    public StravaTokenManager(IConfiguration configuration)
    {
        _clientId = configuration["STRAVA_CLIENT_ID"];
        _clientSecret = configuration["STRAVA_CLIENT_SECRET"];
    }

    public async Task<string> GetAccessTokenAsync()
    {
        if (string.IsNullOrEmpty(_accessToken) || DateTime.UtcNow >= _accessTokenExpiresAt)
        {
            await RefreshAccessTokenAsync();
        }

        return _accessToken;
    }

    private async Task RefreshAccessTokenAsync()
    {
        var client = new RestClient("https://www.strava.com/api/v3/oauth/token");
        var request = new RestRequest(Method.Post);
        request.AddParameter("client_id", _clientId);
        request.AddParameter("client_secret", _clientSecret);
        request.AddParameter("grant_type", "refresh_token");
        request.AddParameter("refresh_token", _refreshToken);

        var response = await client.ExecuteAsync(request);
        if (!response.IsSuccessful)
        {
            throw new Exception($"Failed to refresh token: {response.ErrorMessage}");
        }

        var tokenResponse = JsonSerializer.Deserialize<StravaTokenResponse>(response.Content);

        _accessToken = tokenResponse.AccessToken;
        _refreshToken = tokenResponse.RefreshToken;
        _accessTokenExpiresAt = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn);

        Console.WriteLine("Access token refreshed successfully.");
    }
}

public class StravaTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; }

    [JsonPropertyName("refresh_token")]
    public string RefreshToken { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}