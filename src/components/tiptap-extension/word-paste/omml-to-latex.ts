/**
 * OMML (Office Math Markup Language) to LaTeX converter.
 * Converts Microsoft Word math equations (OMML XML) to LaTeX strings.
 *
 * Based on the dwml Python library:
 * https://github.com/pydocx/pydocx
 */

const OMML_NS = "http://schemas.openxmlformats.org/officeDocument/2006/math";

// Unicode to LaTeX character mappings
const CHR_MAP: Record<string, string> = {
  // Top accents
  "\u0300": "\\grave{{{0}}}",
  "\u0301": "\\acute{{{0}}}",
  "\u0302": "\\hat{{{0}}}",
  "\u0303": "\\tilde{{{0}}}",
  "\u0304": "\\bar{{{0}}}",
  "\u0306": "\\breve{{{0}}}",
  "\u0307": "\\dot{{{0}}}",
  "\u0308": "\\ddot{{{0}}}",
  "\u030c": "\\check{{{0}}}",
  "\u0338": "\\not{{{0}}}",
  "\u20d6": "\\overleftarrow{{{0}}}",
  "\u20d7": "\\vec{{{0}}}",
  "\u20db": "\\dddot{{{0}}}",
  "\u20e1": "\\overleftrightarrow{{{0}}}",
  // Bottom accents
  "\u0330": "\\wideutilde{{{0}}}",
  "\u0331": "\\underbar{{{0}}}",
  // Over group
  "\u23b4": "\\overbracket{{{0}}}",
  "\u23dc": "\\overparen{{{0}}}",
  "\u23de": "\\overbrace{{{0}}}",
  // Under group
  "\u23b5": "\\underbracket{{{0}}}",
  "\u23dd": "\\underparen{{{0}}}",
  "\u23df": "\\underbrace{{{0}}}",
};

// Big operators
const CHR_BO: Record<string, string> = {
  "\u220f": "\\prod",
  "\u2210": "\\coprod",
  "\u2211": "\\sum",
  "\u222b": "\\int",
  "\u222c": "\\iint",
  "\u222d": "\\iiint",
  "\u22c0": "\\bigwedge",
  "\u22c1": "\\bigvee",
  "\u22c2": "\\bigcap",
  "\u22c3": "\\bigcup",
  "\u2a00": "\\bigodot",
  "\u2a01": "\\bigoplus",
  "\u2a02": "\\bigotimes",
};

// Text/symbol replacements
const T_MAP: Record<string, string> = {
  "\u2192": "\\rightarrow ",
  "\u2190": "\\leftarrow ",
  "\u2191": "\\uparrow ",
  "\u2193": "\\downarrow ",
  "\u2194": "\\leftrightarrow ",
  "\u2195": "\\updownarrow ",
  "\u2196": "\\nwarrow ",
  "\u2197": "\\nearrow ",
  "\u2198": "\\searrow ",
  "\u2199": "\\swarrow ",
  "\u22ee": "\\vdots ",
  "\u22ef": "\\cdots ",
  "\u22f0": "\\adots ",
  "\u22f1": "\\ddots ",
  "\u2260": "\\ne ",
  "\u2264": "\\leq ",
  "\u2265": "\\geq ",
  "\u226a": "\\ll ",
  "\u226b": "\\gg ",
  "\u2208": "\\in ",
  "\u2209": "\\notin ",
  "\u220b": "\\ni ",
  "\u221e": "\\infty ",
  "\u00b1": "\\pm ",
  "\u2213": "\\mp ",
  "\u00d7": "\\times ",
  "\u00f7": "\\div ",
  "\u2217": "\\ast ",
  "\u2218": "\\circ ",
  "\u2219": "\\cdot ",
  "\u22c5": "\\cdot ",
  "\u2229": "\\cap ",
  "\u222a": "\\cup ",
  "\u2227": "\\wedge ",
  "\u2228": "\\vee ",
  "\u2200": "\\forall ",
  "\u2203": "\\exists ",
  "\u2204": "\\nexists ",
  "\u2202": "\\partial ",
  "\u2207": "\\nabla ",
  "\u221a": "\\sqrt ",
  "\u2026": "\\ldots ",
  "\u2205": "\\emptyset ",
  "\u2282": "\\subset ",
  "\u2283": "\\supset ",
  "\u2286": "\\subseteq ",
  "\u2287": "\\supseteq ",
  "\u2245": "\\cong ",
  "\u2248": "\\approx ",
  "\u2261": "\\equiv ",
  "\u22a5": "\\perp ",
  "\u2225": "\\parallel ",
  "\u2220": "\\angle ",
  "\u2032": "'",
  "\u2033": "''",
  // Greek lowercase (Mathematical Italic)
  "\u{1d6fc}": "\\alpha ",
  "\u{1d6fd}": "\\beta ",
  "\u{1d6fe}": "\\gamma ",
  "\u{1d6ff}": "\\delta ",
  "\u{1d700}": "\\epsilon ",
  "\u{1d701}": "\\zeta ",
  "\u{1d702}": "\\eta ",
  "\u{1d703}": "\\theta ",
  "\u{1d704}": "\\iota ",
  "\u{1d705}": "\\kappa ",
  "\u{1d706}": "\\lambda ",
  "\u{1d707}": "\\mu ",
  "\u{1d708}": "\\nu ",
  "\u{1d709}": "\\xi ",
  "\u{1d70b}": "\\pi ",
  "\u{1d70c}": "\\rho ",
  "\u{1d70e}": "\\sigma ",
  "\u{1d70f}": "\\tau ",
  "\u{1d710}": "\\upsilon ",
  "\u{1d711}": "\\phi ",
  "\u{1d712}": "\\chi ",
  "\u{1d713}": "\\psi ",
  "\u{1d714}": "\\omega ",
  "\u{1d715}": "\\partial ",
  "\u{1d716}": "\\varepsilon ",
  "\u{1d717}": "\\vartheta ",
  "\u{1d719}": "\\varphi ",
  "\u{1d71a}": "\\varrho ",
  "\u{1d71b}": "\\varpi ",
  // Mathematical Italic Latin uppercase
  "\u{1d434}": "A",
  "\u{1d435}": "B",
  "\u{1d436}": "C",
  "\u{1d437}": "D",
  "\u{1d438}": "E",
  "\u{1d439}": "F",
  "\u{1d43a}": "G",
  "\u{1d43b}": "H",
  "\u{1d43c}": "I",
  "\u{1d43d}": "J",
  "\u{1d43e}": "K",
  "\u{1d43f}": "L",
  "\u{1d440}": "M",
  "\u{1d441}": "N",
  "\u{1d442}": "O",
  "\u{1d443}": "P",
  "\u{1d444}": "Q",
  "\u{1d445}": "R",
  "\u{1d446}": "S",
  "\u{1d447}": "T",
  "\u{1d448}": "U",
  "\u{1d449}": "V",
  "\u{1d44a}": "W",
  "\u{1d44b}": "X",
  "\u{1d44c}": "Y",
  "\u{1d44d}": "Z",
  // Mathematical Italic Latin lowercase
  "\u{1d44e}": "a",
  "\u{1d44f}": "b",
  "\u{1d450}": "c",
  "\u{1d451}": "d",
  "\u{1d452}": "e",
  "\u{1d453}": "f",
  "\u{1d454}": "g",
  "\u{1d456}": "i",
  "\u{1d457}": "j",
  "\u{1d458}": "k",
  "\u{1d459}": "l",
  "\u{1d45a}": "m",
  "\u{1d45b}": "n",
  "\u{1d45c}": "o",
  "\u{1d45d}": "p",
  "\u{1d45e}": "q",
  "\u{1d45f}": "r",
  "\u{1d460}": "s",
  "\u{1d461}": "t",
  "\u{1d462}": "u",
  "\u{1d463}": "v",
  "\u{1d464}": "w",
  "\u{1d465}": "x",
  "\u{1d466}": "y",
  "\u{1d467}": "z",
};


const FUNC_MAP: Record<string, string> = {
  sin: "\\sin",
  cos: "\\cos",
  tan: "\\tan",
  arcsin: "\\arcsin",
  arccos: "\\arccos",
  arctan: "\\arctan",
  sinh: "\\sinh",
  cosh: "\\cosh",
  tanh: "\\tanh",
  coth: "\\coth",
  sec: "\\sec",
  csc: "\\csc",
  log: "\\log",
  ln: "\\ln",
  exp: "\\exp",
  det: "\\det",
  dim: "\\dim",
  gcd: "\\gcd",
  hom: "\\hom",
  inf: "\\inf",
  ker: "\\ker",
  lg: "\\lg",
  lim: "\\lim",
  max: "\\max",
  min: "\\min",
  sup: "\\sup",
};

const LIM_FUNC: Record<string, string> = {
  lim: "\\lim",
  max: "\\max",
  min: "\\min",
};

const SPECIAL_CHARS = new Set([
  "{",
  "}",
  "_",
  "^",
  "#",
  "&",
  "$",
  "%",
  "~",
]);

/**
 * Helper to get a child element by local name (ignoring namespace)
 */
function getChild(el: Element, localName: string): Element | null {
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    if (getLocalName(child) === localName) {
      return child;
    }
  }
  return null;
}

/**
 * Get all children with a given local name
 */
function getChildren(el: Element, localName: string): Element[] {
  const result: Element[] = [];
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    if (getLocalName(child) === localName) {
      result.push(child);
    }
  }
  return result;
}

/**
 * Get local name of element (strip namespace prefix)
 */
function getLocalName(el: Element): string {
  return el.localName || el.nodeName.replace(/^[^:]+:/, "");
}

/**
 * Get val attribute from a property element (m:val)
 */
function getVal(el: Element | null): string | null {
  if (!el) return null;
  return (
    el.getAttribute("m:val") ||
    el.getAttribute("val") ||
    el.getAttributeNS(OMML_NS, "val")
  );
}

/**
 * Escape special LaTeX characters
 */
function escapeLatex(str: string): string {
  let result = "";
  let lastChar = "";
  for (const c of str) {
    if (SPECIAL_CHARS.has(c) && lastChar !== "\\") {
      result += "\\" + c;
    } else {
      result += c;
    }
    lastChar = c;
  }
  return result;
}

/**
 * Convert a unicode character to its LaTeX equivalent
 */
function convertChar(ch: string): string {
  return T_MAP[ch] || ch;
}

/**
 * Process an OMML 'r' (run) element - extracts text and converts to LaTeX
 */
function processRun(el: Element): string {
  const tEl = getChild(el, "t");
  if (!tEl) return "";

  const text = tEl.textContent || "";
  let result = "";
  for (const ch of text) {
    result += convertChar(ch);
  }
  return escapeLatex(result);
}

/**
 * Process an 'e' (element/argument) element
 */
function processElement(el: Element): string {
  const parts: string[] = [];
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    const converted = convertNode(child);
    if (converted) {
      parts.push(converted);
    }
  }
  return parts.join("");
}

/**
 * Process fraction (f) element
 */
function processFraction(el: Element): string {
  const fPr = getChild(el, "fPr");
  const num = getChild(el, "num");
  const den = getChild(el, "den");

  const numText = num ? processElement(num) : "";
  const denText = den ? processElement(den) : "";

  let type = "bar";
  if (fPr) {
    const typeEl = getChild(fPr, "type");
    const typeVal = getVal(typeEl);
    if (typeVal) type = typeVal;
  }

  switch (type) {
    case "skw":
      return `^{${numText}}/_{${denText}}`;
    case "lin":
      return `{${numText}}/{${denText}}`;
    case "noBar":
      return `\\genfrac{}{}{0pt}{}{${numText}}{${denText}}`;
    default:
      return `\\frac{${numText}}{${denText}}`;
  }
}

/**
 * Process subscript (sSub) element
 */
function processSSub(el: Element): string {
  const e = getChild(el, "e");
  const sub = getChild(el, "sub");

  const base = e ? processElement(e) : "";
  const subText = sub ? processElement(sub) : "";

  return `${base}_{${subText}}`;
}

/**
 * Process superscript (sSup) element
 */
function processSSup(el: Element): string {
  const e = getChild(el, "e");
  const sup = getChild(el, "sup");

  const base = e ? processElement(e) : "";
  const supText = sup ? processElement(sup) : "";

  return `${base}^{${supText}}`;
}

/**
 * Process sub-superscript (sSubSup) element
 */
function processSSubSup(el: Element): string {
  const e = getChild(el, "e");
  const sub = getChild(el, "sub");
  const sup = getChild(el, "sup");

  const base = e ? processElement(e) : "";
  const subText = sub ? processElement(sub) : "";
  const supText = sup ? processElement(sup) : "";

  return `${base}_{${subText}}^{${supText}}`;
}

/**
 * Process delimiter (d) element - parentheses, brackets, etc.
 */
function processDelimiter(el: Element): string {
  const dPr = getChild(el, "dPr");
  const eElements = getChildren(el, "e");

  let begChr = "(";
  let endChr = ")";

  if (dPr) {
    const begEl = getChild(dPr, "begChr");
    const endEl = getChild(dPr, "endChr");
    const begVal = getVal(begEl);
    const endVal = getVal(endEl);
    if (begVal !== null) begChr = begVal;
    if (endVal !== null) endChr = endVal;
  }

  const innerParts = eElements.map((e) => processElement(e));
  const inner = innerParts.join(",");

  const left = begChr || ".";
  const right = endChr || ".";

  return `\\left${escapeLatex(left)}${inner}\\right${escapeLatex(right)}`;
}

/**
 * Process radical (rad) element - square root, nth root
 */
function processRadical(el: Element): string {
  const deg = getChild(el, "deg");
  const e = getChild(el, "e");

  const content = e ? processElement(e) : "";
  const degText = deg ? processElement(deg).trim() : "";

  if (degText) {
    return `\\sqrt[${degText}]{${content}}`;
  }
  return `\\sqrt{${content}}`;
}

/**
 * Process n-ary operator (nary) - sum, product, integral, etc.
 */
function processNary(el: Element): string {
  const naryPr = getChild(el, "naryPr");
  const sub = getChild(el, "sub");
  const sup = getChild(el, "sup");
  const e = getChild(el, "e");

  let operator = "\\int";
  if (naryPr) {
    const chrEl = getChild(naryPr, "chr");
    const chrVal = getVal(chrEl);
    if (chrVal) {
      operator = CHR_BO[chrVal] || chrVal;
    }
  }

  const subText = sub ? processElement(sub).trim() : "";
  const supText = sup ? processElement(sup).trim() : "";
  const content = e ? processElement(e) : "";

  let result = operator;
  if (subText) result += `_{${subText}}`;
  if (supText) result += `^{${supText}}`;
  result += ` ${content}`;

  return result;
}

/**
 * Process function-apply (func) element - sin, cos, etc.
 */
function processFunc(el: Element): string {
  const fName = getChild(el, "fName");
  const e = getChild(el, "e");

  let funcName = "";
  if (fName) {
    // Extract function name from the run elements
    const runs = getChildren(fName, "r");
    const nameParts: string[] = [];
    for (const run of runs) {
      const tEl = getChild(run, "t");
      if (tEl) {
        nameParts.push(tEl.textContent || "");
      }
    }
    funcName = nameParts.join("").trim();
  }

  const arg = e ? processElement(e) : "";
  const latexFunc = FUNC_MAP[funcName] || `\\operatorname{${funcName}}`;

  return `${latexFunc}\\left(${arg}\\right)`;
}

/**
 * Process accent (acc) element
 */
function processAccent(el: Element): string {
  const accPr = getChild(el, "accPr");
  const e = getChild(el, "e");

  const content = e ? processElement(e) : "";

  let chrVal: string | null = null;
  if (accPr) {
    const chrEl = getChild(accPr, "chr");
    chrVal = getVal(chrEl);
  }

  const template = chrVal ? CHR_MAP[chrVal] || "\\hat{{{0}}}" : "\\hat{{{0}}}";
  return template.replace("{0}", content);
}

/**
 * Process bar (bar) element - overline/underline
 */
function processBar(el: Element): string {
  const barPr = getChild(el, "barPr");
  const e = getChild(el, "e");

  const content = e ? processElement(e) : "";

  let pos = "top";
  if (barPr) {
    const posEl = getChild(barPr, "pos");
    const posVal = getVal(posEl);
    if (posVal) pos = posVal;
  }

  if (pos === "bot") {
    return `\\underline{${content}}`;
  }
  return `\\overline{${content}}`;
}

/**
 * Process group character (groupChr) element
 */
function processGroupChr(el: Element): string {
  const groupChrPr = getChild(el, "groupChrPr");
  const e = getChild(el, "e");

  const content = e ? processElement(e) : "";

  let chrVal: string | null = null;
  if (groupChrPr) {
    const chrEl = getChild(groupChrPr, "chr");
    chrVal = getVal(chrEl);
  }

  if (chrVal && CHR_MAP[chrVal]) {
    return CHR_MAP[chrVal].replace("{0}", content);
  }

  return content;
}

/**
 * Process lower limit (limLow) element
 */
function processLimLow(el: Element): string {
  const e = getChild(el, "e");
  const lim = getChild(el, "lim");

  const funcText = e ? processElement(e).trim() : "";
  const limText = lim ? processElement(lim).trim() : "";

  const latexFunc = LIM_FUNC[funcText] || funcText;

  if (limText) {
    // Replace rightarrow with \to in limit expressions
    const cleanLim = limText.replace(/\\rightarrow/g, "\\to");
    return `${latexFunc}_{${cleanLim}}`;
  }
  return latexFunc;
}

/**
 * Process upper limit (limUpp) element
 */
function processLimUpp(el: Element): string {
  const e = getChild(el, "e");
  const lim = getChild(el, "lim");

  const text = e ? processElement(e) : "";
  const limText = lim ? processElement(lim) : "";

  return `\\overset{${limText}}{${text}}`;
}

/**
 * Process matrix (m) element
 */
function processMatrix(el: Element): string {
  const rows = getChildren(el, "mr");
  const rowTexts: string[] = [];

  for (const row of rows) {
    const cells = getChildren(row, "e");
    const cellTexts = cells.map((cell) => processElement(cell));
    rowTexts.push(cellTexts.join(" & "));
  }

  return `\\begin{matrix}${rowTexts.join(" \\\\ ")}\\end{matrix}`;
}

/**
 * Process equation array (eqArr) element
 */
function processEqArr(el: Element): string {
  const eElements = getChildren(el, "e");
  const lines = eElements.map((e) => processElement(e));
  return `\\begin{array}{c}${lines.join(" \\\\ ")}\\end{array}`;
}

/**
 * Process box element
 */
function processBox(el: Element): string {
  const e = getChild(el, "e");
  return e ? processElement(e) : "";
}

/**
 * Process pre-sub-superscript (sPre) element
 */
function processSPre(el: Element): string {
  const sub = getChild(el, "sub");
  const sup = getChild(el, "sup");
  const e = getChild(el, "e");

  const subText = sub ? processElement(sub) : "";
  const supText = sup ? processElement(sup) : "";
  const base = e ? processElement(e) : "";

  return `{}_{${subText}}^{${supText}}${base}`;
}

/**
 * Convert a single OMML node to LaTeX
 */
function convertNode(el: Element): string | null {
  const tag = getLocalName(el);

  switch (tag) {
    case "r":
      return processRun(el);
    case "f":
      return processFraction(el);
    case "sSub":
      return processSSub(el);
    case "sSup":
      return processSSup(el);
    case "sSubSup":
      return processSSubSup(el);
    case "d":
      return processDelimiter(el);
    case "rad":
      return processRadical(el);
    case "nary":
      return processNary(el);
    case "func":
      return processFunc(el);
    case "acc":
      return processAccent(el);
    case "bar":
      return processBar(el);
    case "groupChr":
      return processGroupChr(el);
    case "limLow":
      return processLimLow(el);
    case "limUpp":
      return processLimUpp(el);
    case "m":
      return processMatrix(el);
    case "eqArr":
      return processEqArr(el);
    case "box":
      return processBox(el);
    case "sPre":
      return processSPre(el);
    case "e":
    case "num":
    case "den":
    case "deg":
    case "sub":
    case "sup":
    case "lim":
      return processElement(el);
    default:
      // Skip property elements and unknown tags
      if (tag.endsWith("Pr")) return null;
      return null;
  }
}

/**
 * Convert an OMML oMath element to a LaTeX string.
 */
export function ommlToLatex(oMathEl: Element): string {
  const parts: string[] = [];
  for (let i = 0; i < oMathEl.children.length; i++) {
    const child = oMathEl.children[i];
    const result = convertNode(child);
    if (result !== null) {
      parts.push(result);
    }
  }
  return parts.join("").trim();
}

/**
 * Find all oMath elements in an HTML document (from Word paste).
 * Word puts math in <m:oMath> or <oMath> elements.
 */
export function findOmmlElements(doc: Document): Element[] {
  const results: Element[] = [];

  // Try namespace-aware query
  const nsElements = doc.getElementsByTagNameNS(OMML_NS, "oMath");
  for (let i = 0; i < nsElements.length; i++) {
    results.push(nsElements[i]);
  }

  if (results.length > 0) return results;

  // Fallback: try with m: prefix (common in clipboard HTML)
  const prefixedElements = doc.querySelectorAll("m\\:oMath, oMath");
  prefixedElements.forEach((el) => results.push(el));

  return results;
}

/**
 * Find all oMathPara elements (display math containers) in a document.
 */
export function findOmmlParaElements(doc: Document): Element[] {
  const results: Element[] = [];

  const nsElements = doc.getElementsByTagNameNS(OMML_NS, "oMathPara");
  for (let i = 0; i < nsElements.length; i++) {
    results.push(nsElements[i]);
  }

  if (results.length > 0) return results;

  const prefixedElements = doc.querySelectorAll(
    "m\\:oMathPara, oMathPara"
  );
  prefixedElements.forEach((el) => results.push(el));

  return results;
}
