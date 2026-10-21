
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

var apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

if (string.IsNullOrWhiteSpace(apiKey))
{
    Console.WriteLine("Set the GEMINI_API_KEY environment variable first.");
    return;
}

var filePath = Path.Combine(
    AppContext.BaseDirectory,
    "MyProfile_Documentation.txt"
);

if (!File.Exists(filePath))
{
    Console.WriteLine($"TXT file not found: {filePath}");
    return;
}

using var http = new HttpClient();

// 1. Create the File Search store.
var createStoreBody = new
{
    displayName = "MyProfile Documentation",
    embeddingModel = "models/gemini-embedding-2"
};

using var createStoreResponse = await http.PostAsync(
    $"https://generativelanguage.googleapis.com/v1beta/fileSearchStores?key={apiKey}",
    new StringContent(
        JsonSerializer.Serialize(createStoreBody),
        Encoding.UTF8,
        "application/json"
    )
);

var createStoreJson =
    await createStoreResponse.Content.ReadAsStringAsync();

createStoreResponse.EnsureSuccessStatusCode();

using var storeDocument = JsonDocument.Parse(createStoreJson);

var storeName = storeDocument.RootElement
    .GetProperty("name")
    .GetString();

if (string.IsNullOrWhiteSpace(storeName))
{
    throw new Exception("Google did not return a File Search store name.");
}

Console.WriteLine($"Created store: {storeName}");

// 2. Read the TXT file.
var fileBytes = await File.ReadAllBytesAsync(filePath);

// 3. Start a resumable upload to the store.
var uploadStartUrl =
    $"https://generativelanguage.googleapis.com/upload/v1beta/{storeName}:uploadToFileSearchStore?key={apiKey}";

using var startRequest = new HttpRequestMessage(
    HttpMethod.Post,
    uploadStartUrl
);

startRequest.Headers.TryAddWithoutValidation(
    "X-Goog-Upload-Protocol", "resumable"
);
startRequest.Headers.TryAddWithoutValidation(
    "X-Goog-Upload-Command", "start"
);
startRequest.Headers.TryAddWithoutValidation(
    "X-Goog-Upload-Header-Content-Length",
    fileBytes.Length.ToString()
);
startRequest.Headers.TryAddWithoutValidation(
    "X-Goog-Upload-Header-Content-Type", "text/plain"
);

startRequest.Content = new StringContent(
    JsonSerializer.Serialize(new
    {
        displayName = "MyProfile_Documentation.txt"
    }),
    Encoding.UTF8,
    "application/json"
);

using var startResponse = await http.SendAsync(startRequest);

var startResponseText =
    await startResponse.Content.ReadAsStringAsync();

startResponse.EnsureSuccessStatusCode();

if (!startResponse.Headers.TryGetValues(
        "X-Goog-Upload-URL", out var uploadUrls))
{
    throw new Exception(
        "Google did not return an upload URL. Response: " +
        startResponseText
    );
}

var uploadUrl = uploadUrls.First();

// 4. Upload the TXT bytes and finalize.
using var uploadRequest = new HttpRequestMessage(
    HttpMethod.Post,
    uploadUrl
);

uploadRequest.Headers.TryAddWithoutValidation(
    "X-Goog-Upload-Offset", "0"
);
uploadRequest.Headers.TryAddWithoutValidation(
    "X-Goog-Upload-Command", "upload, finalize"
);

uploadRequest.Content = new ByteArrayContent(fileBytes);
uploadRequest.Content.Headers.ContentType =
    new MediaTypeHeaderValue("text/plain");

using var uploadResponse = await http.SendAsync(uploadRequest);

var uploadResponseText =
    await uploadResponse.Content.ReadAsStringAsync();

uploadResponse.EnsureSuccessStatusCode();

using var uploadDocument = JsonDocument.Parse(uploadResponseText);
var uploadRoot = uploadDocument.RootElement;

// 5. Wait for indexing if Google returned a long-running operation.
if (uploadRoot.TryGetProperty("done", out var doneElement)
    && doneElement.ValueKind == JsonValueKind.False)
{
    var operationName = uploadRoot.GetProperty("name").GetString();

    if (string.IsNullOrWhiteSpace(operationName))
    {
        throw new Exception("Upload operation name is missing.");
    }

    while (true)
    {
        await Task.Delay(TimeSpan.FromSeconds(3));

        using var operationResponse = await http.GetAsync(
            $"https://generativelanguage.googleapis.com/v1beta/{operationName}?key={apiKey}"
        );

        var operationJson =
            await operationResponse.Content.ReadAsStringAsync();

        operationResponse.EnsureSuccessStatusCode();

        using var operationDocument = JsonDocument.Parse(operationJson);
        var operationRoot = operationDocument.RootElement;

        if (operationRoot.TryGetProperty("error", out var operationError))
        {
            throw new Exception(
                "Indexing failed: " + operationError.ToString()
            );
        }

        if (operationRoot.TryGetProperty("done", out var operationDone)
            && operationDone.ValueKind == JsonValueKind.True)
        {
            break;
        }
    }
}

// 6. Show the store name to save in ASP.NET Core User Secrets.
Console.WriteLine();
Console.WriteLine("File Search upload/indexing completed.");
Console.WriteLine($"Store name: {storeName}");

