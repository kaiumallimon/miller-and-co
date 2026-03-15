interface PlacesApiReview {
  rating?: number;
  publishTime?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
  };
}

interface PlacesApiResponse {
  reviews?: PlacesApiReview[];
}

export interface ReviewForSchema {
  authorName: string;
  reviewBody: string;
  ratingValue: number;
  datePublished: string;
  reviewUrl?: string;
}

export async function fetchPlaceReviewsForSchema(): Promise<ReviewForSchema[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId || apiKey.startsWith("YOUR_") || placeId.startsWith("YOUR_")) {
    return [];
  }

  const endpoint = `https://places.googleapis.com/v1/places/${placeId}`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as PlacesApiResponse;
    const reviews = data.reviews ?? [];

    return reviews
      .filter((r) => r.rating === 5)
      .map((r) => {
        const text = r.originalText?.text ?? r.text?.text ?? "";
        const author = r.authorAttribution?.displayName ?? "Google user";
        const publishedAt = r.publishTime ?? new Date().toISOString();

        return {
          authorName: author,
          reviewBody: text,
          ratingValue: 5,
          datePublished: publishedAt.slice(0, 10),
          reviewUrl: r.authorAttribution?.uri,
        };
      })
      .filter((r) => r.reviewBody.trim().length > 0);
  } catch {
    return [];
  }
}
