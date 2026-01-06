import { CREATE_PRODUCT_REVIEW } from "@/graphql";
import { bagistoFetch } from "@/utils/bagisto";
import { BagistoCartOperation } from "@/types/types";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const variables = {
           ...body
        };
        const response = await bagistoFetch<BagistoCartOperation>({
            query: CREATE_PRODUCT_REVIEW,
            variables: variables as any,
            cache: "no-store",
        });
        return Response.json({
            data: { ...response.body.data },
        });
    } catch (error) {
        return Response.json(
            {
                message: "Error querying the GraphQL API",
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        );
    }
}
