export type PIIDetection = {
    element: HTMLInputElement | null;
    type: string;
    originalValue: string;
    sanitizedValue?: string;
};

// 1. Detect PII deterministically
export function detectLocalPII(container: HTMLElement): PIIDetection[] {
    const detections: PIIDetection[] = [];

    // Find fields marked by type or custom data attribute
    const inputs = container.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

    inputs.forEach(input => {
        const pType = input.getAttribute('data-privacy-type');
        const val = input.value || input.defaultValue;

        if (pType && val) {
            detections.push({
                element: input,
                type: pType,
                originalValue: val
            });
        }
    });

    return detections;
}

// 2. Sanitize PII (In-Memory Interception)
export function sanitizePII(detections: PIIDetection[]) {
    detections.forEach(d => {
        if (d.type === 'name') {
            d.sanitizedValue = "John Doe";
        } else if (d.type === 'email') {
            d.sanitizedValue = "user@example.com";
        } else if (d.type === 'phone') {
            d.sanitizedValue = "9000000000";
        } else if (d.type === 'password') {
            d.sanitizedValue = "TOKEN_82A1";
        } else if (d.type === 'creditcard') {
            d.sanitizedValue = "4111 XXXX XXXX XXXX";
        }
    });
}

// 3. Privacy Gate validation
export function evaluatePrivacyGate(payloadStr: string, detections: PIIDetection[]): { safe: boolean, rawPiiFound: number } {
    let rawPiiFound = 0;

    detections.forEach(d => {
        // If the original value is somehow still in the payload, we flag it.
        // Skip empty strings
        if (d.originalValue.trim().length > 0 && payloadStr.includes(d.originalValue)) {
            rawPiiFound++;
        }
    });

    return {
        safe: rawPiiFound === 0,
        rawPiiFound
    };
}
