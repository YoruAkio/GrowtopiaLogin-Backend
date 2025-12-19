# Growtopia Login Backend

A backend service for Growtopia login system built with ElysiaJS and Bun runtime.

## Hosting Usage

Tutorial:

[![Tutorial Videos](http://img.youtube.com/vi/8OXt1tHmeAM/0.jpg)](http://www.youtube.com/watch?v=8OXt1tHmeAM)

## API Endpoints

- `GET /` - Returns a greeting message
- `ALL /player/login/dashboard` - Serves the login dashboard HTML page
- `POST /player/growid/login/validate` - Validates GrowID login credentials
- `POST /player/growid/checktoken` - Validates and refreshes authentication token

## How It Works

### 1. Dashboard Request

When a user accesses `/player/login/dashboard`, the server:
- Receives client data in the request body (optional)
- Parses the data into key-value pairs
- Converts the data to base64 format
- Serves the dashboard HTML with the encoded data injected into the `_token` field

### 2. Login Validation

After the user submits the login form from `/player/login/dashboard`, a POST request is sent to `/player/growid/login/validate` containing:

```txt
type=log
_token=<base64_encoded_client_data>
growId=<username>
password=<user_password>
```

Then responds with:

```json
{
  "status": "success",
  "message": "Account Validated.",
  "token": "<base64_encoded_credentials>",
  "url": "",
  "accountType": "growtopia"
}
```

**Note:** This implementation always validates successfully as it doesn't connect to a database. You should implement proper credential validation against your server database.

### 3. Token Verification

The Growtopia client sends data to the server in this format:

```txt
protocol|225
ltoken|X3Rva2VuPWV5SjBZVzVyU1VST1lX...
platformID|0,1,1
adc|1
```

The `ltoken` is a base64-encoded string that decodes to:

```txt
_token=eyJ0YW5rSUROYW1lIjoiYWtpbyIs...&growId=UserName&password=UserPass
```

#### Token Structure

- `_token` - Base64-encoded JSON containing client information (RID, MAC address, game version, etc.)
- `growId` - Username
- `password` - User password
- `reg` - Registration status (0 = login, 1 = register)

### 4. Token Refresh

Endpoint `/player/growid/checktoken` handles token refresh requests:

**Request:**
```json
{
  "data": {
    "refreshToken": "<base64_token>",
    "clientData": "<new_client_data>"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Token is valid.",
  "token": "<updated_base64_token>",
  "url": "",
  "accountType": "growtopia"
}
```

## Installation

```bash
bun install
```

## Development

```bash
bun run dev
```

## Contact

- Telegram: [@ethermite](https://t.me/ethermite)
- Discord: [Nakai Community](https://discord.gg/UFr8C9gCq9)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
