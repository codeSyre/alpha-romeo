import { featureFlagEvents } from "@/features/flags";
import { client } from "./schematic";

export async function checkFeatureUsageLimit(userId: string, eventSubtype: string): Promise<{success: boolean, error?: string}> {
    try{
        const entitlements = await client.entitlements.getFeatureUsageByCompany({
            keys: {
                id: userId
            }
        })

        const feature = entitlements.data.features.find((entitlement) => entitlement.feature?.eventSubtype === eventSubtype)

        if(!feature) {
            return {success: false, error: "This feature is not available for your current plan, please upgrade to continue"}
        }

        const {usage, allocation} = feature

        if(usage === undefined || allocation === undefined) {
            return {
                success: false,
                error: "System Error - Contact SUpport"
            }
        }

        const hasExceededLimit = usage >= allocation

        if(hasExceededLimit) {
            const featureName = Object.entries(featureFlagEvents).find(
                ([, value]) => value.event === eventSubtype
            )?.[0] || eventSubtype

            return {
                success: false,
                error: `You have reached your ${featureName} limit, please upgrade to continue.`
            }
        }

        return {success: true}
    } catch(error){
        console.error("Error checking feature usage limit:", error)
        return {success: false, error: "Error checking feature usage limit"}
    }
}