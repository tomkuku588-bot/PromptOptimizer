import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pages = ["index.html", "privacy-policy.html", "user-agreement.html"];
const requiredShared = ["./styles.css", "./script.js", "data-set-language=\"zh\"", "data-set-language=\"en\""];

for (const page of pages) {
  const html = await readFile(resolve(root, page), "utf8");
  for (const marker of requiredShared) {
    if (!html.includes(marker)) throw new Error(`${page} 缺少 ${marker}`);
  }
  if (!html.includes("data-language-panel=\"zh\"") || !html.includes("data-language-panel=\"en\"")) {
    throw new Error(`${page} 缺少中英文内容面板`);
  }
}

const privacy = await readFile(resolve(root, "privacy-policy.html"), "utf8");
for (const marker of ["ohos.permission.INTERNET", "剪贴板", "Third-Party Services", "tomkuku588@gmail.com"]) {
  if (!privacy.includes(marker)) throw new Error(`隐私政策缺少关键说明：${marker}`);
}

const terms = await readFile(resolve(root, "user-agreement.html"), "utf8");
for (const marker of ["服务边界", "用户行为规范", "Intellectual Property", "Governing Law"]) {
  if (!terms.includes(marker)) throw new Error(`用户协议缺少关键说明：${marker}`);
}

console.log(`Static legal site verified: ${pages.length} pages, bilingual content, required disclosures present.`);
