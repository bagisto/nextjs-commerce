import { CREATE_PRODUCT_REVIEW } from "@/graphql";
import { bagistoFetch } from "@/utils/bagisto";
import { isBagistoError } from "@/utils/type-guards";
import { getAuthToken } from "@/utils/helper";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const guestToken = getAuthToken(req);

        const variables = {
            ...body
        };
        const response = await bagistoFetch<any>({
            query: CREATE_PRODUCT_REVIEW,
            variables: variables as any,
            cache: "no-store",
            guestToken,
        });
        return Response.json({
            data: { ...response.body.data },
        });
    } catch (error) {
        if (isBagistoError(error)) {
            return Response.json(
                {
                    data: { createProductReview: null },
                    error: error.cause ?? error,
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                message: "Network error",
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
