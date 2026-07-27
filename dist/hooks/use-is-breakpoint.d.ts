type BreakpointMode = "min" | "max";
/**
 * Hook to detect whether the current viewport matches a given breakpoint rule.
 * Example:
 *   useIsBreakpoint("max", 768)   // true when width < 768
 *   useIsBreakpoint("min", 1024)  // true when width >= 1024
 */
export declare function useIsBreakpoint(mode?: BreakpointMode, breakpoint?: number): boolean;
export {};
