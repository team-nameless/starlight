import type { MetricData } from "../frontend/src/recsystem/met";

/**
 * Validates and formats the metric data from Emotiv format to our MetricData format
 */
export function formatMetric(metricData: any[]): MetricData[] {
    // Print the raw data for debugging
    console.log("Raw metric data:", JSON.stringify(metricData));

    // Check if we have valid data
    if (!Array.isArray(metricData)) {
        console.warn("Invalid metric data format (not an array):", metricData);
        return getDefaultMetrics();
    }

    try {
        // Create the formatted metrics array
        const formattedMetrics: MetricData[] = [];

        // Process focus
        if (metricData[0] !== undefined && metricData[1] !== undefined) {
            formattedMetrics.push({
                isActive: Boolean(metricData[0]),
                value: ensureNumber(metricData[1])
            });
        } else {
            formattedMetrics.push({ isActive: true, value: 0.5 }); // Default focus
        }

        // Process engagement
        if (metricData[2] !== undefined && metricData[3] !== undefined) {
            formattedMetrics.push({
                isActive: Boolean(metricData[2]),
                value: ensureNumber(metricData[3])
            });
        } else {
            formattedMetrics.push({ isActive: true, value: 0.5 }); // Default engagement
        }

        // Process excitement - ONLY use "exc" value, not "lex"
        if (metricData[4] !== undefined && metricData[5] !== undefined) {
            formattedMetrics.push({
                isActive: Boolean(metricData[4]),
                value: ensureNumber(metricData[5])
            });
        } else {
            formattedMetrics.push({ isActive: true, value: 0.5 }); // Default excitement
        }

        // Process interest
        if (metricData[7] !== undefined && metricData[8] !== undefined) {
            formattedMetrics.push({
                isActive: Boolean(metricData[7]),
                value: ensureNumber(metricData[8])
            });
        } else {
            formattedMetrics.push({ isActive: true, value: 0.5 }); // Default interest
        }

        // Process relaxation
        if (metricData[9] !== undefined && metricData[10] !== undefined) {
            formattedMetrics.push({
                isActive: Boolean(metricData[9]),
                value: ensureNumber(metricData[10])
            });
        } else {
            formattedMetrics.push({ isActive: true, value: 0.5 }); // Default relaxation
        }

        // Process stress
        if (metricData[11] !== undefined && metricData[12] !== undefined) {
            formattedMetrics.push({
                isActive: Boolean(metricData[11]),
                value: ensureNumber(metricData[12])
            });
        } else {
            formattedMetrics.push({ isActive: true, value: 0.4 }); // Default stress
        }

        // Print the formatted data for debugging
        console.log("Formatted metrics:", JSON.stringify(formattedMetrics));

        return formattedMetrics;
    } catch (error) {
        console.error("Error formatting metric data:", error);
        console.warn("Raw metric data:", metricData);
        return getDefaultMetrics();
    }
}

/**
 * Ensures a value is a valid number between 0 and 1, or returns a default
 */
export function ensureNumber(value: any, defaultValue: number = 0.5): number {
    const num = Number(value);
    if (isNaN(num)) {
        return defaultValue;
    }
    return Math.max(0, Math.min(1, num));
}

/**
 * Returns default metric values
 */
export function getDefaultMetrics(): MetricData[] {
    return [
        { isActive: true, value: 0.5 }, // focus
        { isActive: true, value: 0.5 }, // engagement
        { isActive: true, value: 0.5 }, // excitement (only exc)
        { isActive: true, value: 0.5 }, // interest
        { isActive: true, value: 0.5 }, // relaxation
        { isActive: true, value: 0.4 } // stress
    ];
}

/**
 * Validates a complete MetricData array to ensure it has all required fields
 */
export function validateMetricData(data: any[]): boolean {
    if (!Array.isArray(data) || data.length !== 6) {
        return false;
    }

    for (const item of data) {
        if (
            typeof item !== "object" ||
            item === null ||
            typeof item.isActive !== "boolean" ||
            typeof item.value !== "number" ||
            isNaN(item.value)
        ) {
            return false;
        }
    }

    return true;
}
