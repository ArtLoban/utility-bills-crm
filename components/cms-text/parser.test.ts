import { describe, expect, it } from "vitest";
import { parse } from "./parser";

describe("parse", () => {
  it("returns plain text unchanged", () => {
    expect(parse("hello world")).toEqual([{ type: "text", value: "hello world" }]);
  });

  it("parses **bold** to a bold segment", () => {
    expect(parse("**x**")).toEqual([{ type: "bold", value: "x" }]);
  });

  it("parses `code` to a code segment", () => {
    expect(parse("`x`")).toEqual([{ type: "code", value: "x" }]);
  });

  it("wraps text around bold markers", () => {
    expect(parse("Hello **world** today")).toEqual([
      { type: "text", value: "Hello " },
      { type: "bold", value: "world" },
      { type: "text", value: " today" },
    ]);
  });

  it("wraps text around code markers", () => {
    expect(parse("use `foo` here")).toEqual([
      { type: "text", value: "use " },
      { type: "code", value: "foo" },
      { type: "text", value: " here" },
    ]);
  });

  it("parses bold after code", () => {
    expect(parse("`a` and **b**")).toEqual([
      { type: "code", value: "a" },
      { type: "text", value: " and " },
      { type: "bold", value: "b" },
    ]);
  });

  it("parses code after bold", () => {
    expect(parse("**a** then `b`")).toEqual([
      { type: "bold", value: "a" },
      { type: "text", value: " then " },
      { type: "code", value: "b" },
    ]);
  });

  it("does NOT parse bold inside a code span", () => {
    expect(parse("`**notbold**`")).toEqual([{ type: "code", value: "**notbold**" }]);
  });

  it("renders a lone ** literally (no match, no throw)", () => {
    const result = parse("price is ** here");
    expect(result).toEqual([{ type: "text", value: "price is ** here" }]);
  });

  it("renders a lone backtick literally (no match, no throw)", () => {
    const result = parse("foo ` bar");
    expect(result).toEqual([{ type: "text", value: "foo ` bar" }]);
  });

  it("handles multiple bold spans", () => {
    expect(parse("**a** and **b**")).toEqual([
      { type: "bold", value: "a" },
      { type: "text", value: " and " },
      { type: "bold", value: "b" },
    ]);
  });

  it("handles multiple code spans", () => {
    expect(parse("`a` / `b`")).toEqual([
      { type: "code", value: "a" },
      { type: "text", value: " / " },
      { type: "code", value: "b" },
    ]);
  });

  it("parses tokens within a paragraph after \\n\\n split", () => {
    const text = "**Where it is now.** Active development.";
    const para = text.split(/\n\n+/)[0] ?? "";
    expect(parse(para)).toEqual([
      { type: "bold", value: "Where it is now." },
      { type: "text", value: " Active development." },
    ]);
  });

  it("returns empty array for empty string", () => {
    expect(parse("")).toEqual([]);
  });
});
