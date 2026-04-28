const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export function setAuthTokenCookie(token: string) {
  const isSecureContext = window.location.protocol === "https:";
  const cookieParts = [
    `authToken=${encodeURIComponent(token)}`,
    "path=/",
    `max-age=${ONE_DAY_IN_SECONDS}`,
    "samesite=lax",
  ];

  if (isSecureContext) {
    cookieParts.push("secure");
  }

  document.cookie = cookieParts.join("; ");
}
