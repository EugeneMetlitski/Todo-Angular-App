namespace Web.Auth;

public static class AuthConstants
{
    public const string Issuer = "MyAppAuth";
    public const string Audience = "MyAppClient";
    public const string SecretKey = "ThisIsASecretKeyForJwtTokenGenerationAndValidationInMyApp!123456";
}
