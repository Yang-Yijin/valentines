namespace Valentine.Models;

public sealed class ValentineContent
{
    public string GirlfriendName { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string LoveLetter { get; init; } = string.Empty;
    public DateOnly RelationshipStartDate { get; init; }
    public string SurpriseMessage { get; init; } = string.Empty;
    public string Signature { get; init; } = string.Empty;
    public string? MusicUrl { get; init; }
    public string? SecretMusicUrl { get; init; }
    public IReadOnlyList<string> Photos { get; init; } = [];
}
