/**
 * OMML (Office Math Markup Language) to LaTeX converter.
 * Converts Microsoft Word math equations (OMML XML) to LaTeX strings.
 *
 * Based on the dwml Python library:
 * https://github.com/pydocx/pydocx
 */
/**
 * Convert an OMML oMath element to a LaTeX string.
 */
export declare function ommlToLatex(oMathEl: Element): string;
/**
 * Find all oMath elements in an HTML document (from Word paste).
 * Word puts math in <m:oMath> or <oMath> elements.
 */
export declare function findOmmlElements(doc: Document): Element[];
/**
 * Find all oMathPara elements (display math containers) in a document.
 */
export declare function findOmmlParaElements(doc: Document): Element[];
