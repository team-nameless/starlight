using Newtonsoft.Json;

namespace Starlight.Backend.Controller.Request;

public class PartialScoreStatistics
{
    [JsonProperty("crit")]
    public ulong Critical {get; set; }
    
    [JsonProperty("perf")]
    public ulong Perfect {get; set; }
    
    [JsonProperty("good")]
    public ulong Good {get; set; }
    
    [JsonProperty("bad")]
    public ulong Bad {get; set; }
    
    [JsonProperty("miss")]
    public ulong Miss {get; set; }
}

[JsonObject]
public class ScoreStatistics : PartialScoreStatistics
{
    [JsonProperty("score")]
    public ulong Score { get; set; }
    
    [JsonProperty("accuracy")]
    public float Accuracy { get; set; }
    
    [JsonProperty("duration")]
    public ulong Duration { get; set; }
    
    [JsonProperty("maxCombo")]
    public ulong MaxCombo { get; set; }
    
    [JsonProperty("grade")]
    public required string Grade { get; set; }
}

[JsonObject]
public class PartitionedScoreStatistics : PartialScoreStatistics
{
    [JsonProperty("totalNotes")]
    public ulong TotalNotes { get; set; }
}

public class ScoreSubmissionRequest
{
    [JsonProperty("trackId")]
    public required ulong TrackId { get; set; }

    [JsonProperty("stats")]
    public required ScoreStatistics Statistics { get; set; }

    [JsonProperty("partial")]
    public required List<PartitionedScoreStatistics> PartialScoreStatistics { get; set; }
}