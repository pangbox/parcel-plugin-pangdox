import Asset from "parcel-bundler/lib/Asset";
import path from "path";
import { TemplateRenderer } from "./template";

const TITLE_RE = /^\# (.+)\n/;

class MarkdownAsset extends Asset {
  ast: string = "";
  renderer: TemplateRenderer;

  constructor(filepath: string, options: any) {
    super(filepath, options);
    this.type = "html";
    this.renderer = new TemplateRenderer(this.templatesDir, this.kaitaiDir, this);
  }

  get repoRoot() {
    return path.dirname(this.options.rootDir)
  }

  get templatesDir() {
    return path.resolve(this.options.rootDir, "templates");
  }

  get kaitaiDir() {
    return path.resolve(this.options.rootDir, "scripts/kaitai");
  }

  async parse(code: string): Promise<string> {
    return code;
  }

  getTemplateContext() {
    const title = TITLE_RE.exec(this.ast);
    return {
      title: title != null ? title[1] : undefined,
      code: this.ast,
      repopath: path.relative(this.repoRoot, this.name),
    };
  }

  async generate() {
    return [
      {
        type: "html",
        value: await this.renderer.render("markdown", this.getTemplateContext())
      }
    ];
  }
}

module.exports = MarkdownAsset;
