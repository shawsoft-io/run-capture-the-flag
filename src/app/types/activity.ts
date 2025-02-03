import { User } from "./user";

export interface Activity {
    id: string;
    athlete_id: string;
    date_time_local: string; // ISO string
    distance: number; // in meters
    duration: number; // in seconds
    city: string;
    country: string;
    map_url: string;
    pace: string; // formatted string
    activity_points: number;
    fastest_monthly_5km: boolean;
    claimed: boolean;
    user : User
  }