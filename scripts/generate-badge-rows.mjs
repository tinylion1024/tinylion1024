import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rows = {
  tech: [
    ["Python", "3776AB", "python", "white"],
    ["TypeScript", "3178C6", "typescript", "white"],
    ["SQL", "4479A1", "", "white"],
    ["Bash", "4EAA25", "gnubash", "white"],
  ],
  "ai-workflow": [
    ["Claude Code", "D97757", "anthropic", "white"],
    ["Codex CLI", "412991", "openai", "white"],
    ["Warp", "01A4FF", "warp", "white"],
    ["Ghostty", "000000", "ghostty", "white"],
    ["tmux", "1BB91F", "tmux", "white"],
    ["Zellij", "FF6B35", "zellij", "white"],
  ],
  learning: [
    ["Go", "00ADD8", "go", "white"],
    ["Rust", "000000", "rust", "white"],
    ["Swift", "FA7343", "swift", "white"],
  ],
  experience: [
    ["C", "A8B9CC", "c", "black"],
    ["Java", "007396", "openjdk", "white"],
    ["Scala", "DC322F", "scala", "white"],
    ["Machine Learning", "F7931E", "", "white"],
    ["Deep Learning", "FF6F00", "", "white"],
    ["Apache Spark", "E25A1C", "apachespark", "white"],
    ["Hadoop", "66CCFF", "apachehadoop", "black"],
    ["Apache Hive", "FDEE21", "apachehive", "black"],
  ],
  "past-tools": [
    ["VS Code", "007ACC", "visualstudiocode", "white"],
    ["Cursor", "000000", "cursor", "white"],
    ["IntelliJ IDEA", "000000", "intellijidea", "white"],
    ["PyCharm", "000000", "pycharm", "white"],
    ["iTerm2", "000000", "iterm2", "white"],
    ["Augment Code", "5B4BFF", "", "white"],
  ],
};

const gap = 6;
const mobileMaxWidth = 300;
const sectionGap = 20;
const labelGap = 14;
const labels = {
  en: {
    tech: "Tech I Use:",
    "ai-workflow": "AI Workflow:",
    learning: "Learning:",
    experience: "Earlier experience:",
    "past-tools": "Past tools:",
  },
  cn: {
    tech: "技术栈：",
    "ai-workflow": "AI 开发工作流：",
    learning: "正在学习：",
    experience: "过往经验：",
    "past-tools": "曾用工具：",
  },
};
const labelWidths = {
  en: {
    tech: 90,
    "ai-workflow": 96,
    learning: 71,
    experience: 144,
    "past-tools": 76,
  },
  cn: {
    tech: 64,
    "ai-workflow": 120,
    learning: 80,
    experience: 80,
    "past-tools": 80,
  },
};
const outputDirectory = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../assets/badges",
);

function badgeUrl([label, color, logo, logoColor]) {
  const parameters = new URLSearchParams({ style: "flat-square" });

  if (logo) parameters.set("logo", logo);
  parameters.set("logoColor", logoColor);

  return `https://img.shields.io/badge/-${encodeURIComponent(label)}-${color}?${parameters}`;
}

function attribute(source, name) {
  return source.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];
}

function inlineLogoImages(source) {
  return source.replace(
    /<image\b([^>]*?)href="data:image\/svg\+xml;base64,([^"]+)"([^>]*)\/>/g,
    (_, beforeHref, encodedLogo, afterHref) => {
      const imageAttributes = `${beforeHref}${afterHref}`;
      const logo = Buffer.from(encodedLogo, "base64").toString("utf8");
      const match = logo.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);

      if (!match) throw new Error("Unexpected embedded logo SVG");

      const [, logoAttributes, logoBody] = match;
      const dimensions = ["x", "y", "width", "height"]
        .map((name) => `${name}="${attribute(imageAttributes, name)}"`)
        .join(" ");
      const viewBox = attribute(logoAttributes, "viewBox");
      const fill = attribute(logoAttributes, "fill");

      return [
        `<svg ${dimensions} viewBox="${viewBox}"`,
        fill ? ` fill="${fill}"` : "",
        `>${logoBody.replace(/<title>.*?<\/title>/, "")}</svg>`,
      ].join("");
    },
  );
}

async function fetchBadge(badge) {
  const response = await fetch(badgeUrl(badge));
  if (!response.ok) {
    throw new Error(`Unable to fetch ${badge[0]} badge: ${response.status}`);
  }

  const source = await response.text();
  const width = Number(source.match(/\bwidth="(\d+)"/)?.[1]);
  const height = Number(source.match(/\bheight="(\d+)"/)?.[1]);
  const body = source.match(/^<svg[^>]*>([\s\S]*)<\/svg>$/)?.[1];

  if (!width || height !== 20 || !body) {
    throw new Error(`Unexpected SVG returned for ${badge[0]}`);
  }

  return {
    width,
    body: inlineLogoImages(body.replace(/<title>.*?<\/title>/, "")),
  };
}

function rowWidth(badges) {
  return (
    badges.reduce((total, badge) => total + badge.width, 0) +
    gap * (badges.length - 1)
  );
}

function renderRows(name, rows) {
  const width = Math.max(...rows.map(rowWidth));
  const height = rows.length * 20 + (rows.length - 1) * gap;
  const content = rows
    .flatMap((row, rowIndex) => {
      let x = 0;
      const y = rowIndex * (20 + gap);
      return row.map((badge) => {
        const group = `<g transform="translate(${x} ${y})">${badge.body}</g>`;
        x += badge.width + gap;
        return group;
      });
    })
    .join("");

  return [
    '<svg xmlns="http://www.w3.org/2000/svg"',
    ` width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`,
    ` role="img" aria-label="${name}">`,
    `<title>${name}</title>${content}</svg>\n`,
  ].join("");
}

function wrapBadges(badges) {
  return badges.reduce(
    (rows, badge) => {
      const currentRow = rows.at(-1);
      const candidate = [...currentRow, badge];

      if (currentRow.length && rowWidth(candidate) > mobileMaxWidth) {
        rows.push([badge]);
      } else {
        currentRow.push(badge);
      }

      return rows;
    },
    [[]],
  );
}

function renderProfile(language, badgeRows, mobile = false) {
  const profileLabels = labels[language];
  const renderedSections = Object.entries(badgeRows).map(([name, badges]) => ({
    name,
    label: profileLabels[name],
    rows: mobile ? wrapBadges(badges) : [badges],
  }));
  const width = mobile
    ? mobileMaxWidth
    : Math.max(
      ...Object.entries(badgeRows).map(
        ([name, badges]) =>
          labelWidths[language][name] + labelGap + rowWidth(badges),
      ),
    );
  let y = 0;
  const content = renderedSections
    .map(({ name, label, rows: sectionRows }) => {
      const labelY = y + 16;
      const badgesY = mobile ? y + 26 : y;
      const labelElement = `<text class="section-label" x="0" y="${labelY}">${label}</text>`;
      const badgeElements = sectionRows
        .flatMap((row, rowIndex) => {
          let x = mobile ? 0 : labelWidths[language][name] + labelGap;
          const rowY = badgesY + rowIndex * (20 + gap);
          return row.map((badge) => {
            const group = `<g transform="translate(${x} ${rowY})">${badge.body}</g>`;
            x += badge.width + gap;
            return group;
          });
        })
        .join("");
      const sectionHeight = mobile
        ? 26 + sectionRows.length * 20 + (sectionRows.length - 1) * gap
        : 20;

      y += sectionHeight + sectionGap;
      return labelElement + badgeElements;
    })
    .join("");
  const height = y - sectionGap;
  const title = language === "cn" ? "技术栈与工具" : "Technology and tools";

  return [
    '<svg xmlns="http://www.w3.org/2000/svg"',
    ` width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"`,
    ` role="img" aria-label="${title}">`,
    `<title>${title}</title>`,
    '<style>.section-label{fill:#1f2328;font:600 16px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}@media(prefers-color-scheme:dark){.section-label{fill:#f0f6fc}}</style>',
    content,
    "</svg>\n",
  ].join("");
}

await mkdir(outputDirectory, { recursive: true });

const fetchedRows = {};

for (const [name, definitions] of Object.entries(rows)) {
  const badges = await Promise.all(definitions.map(fetchBadge));
  fetchedRows[name] = badges;
  await writeFile(
    resolve(outputDirectory, `${name}.svg`),
    renderRows(name, [badges]),
  );

  if (rowWidth(badges) > mobileMaxWidth) {
    await writeFile(
      resolve(outputDirectory, `${name}-mobile.svg`),
      renderRows(`${name} mobile`, wrapBadges(badges)),
    );
  }
}

for (const language of Object.keys(labels)) {
  await writeFile(
    resolve(outputDirectory, `profile-${language}.svg`),
    renderProfile(language, fetchedRows),
  );
  await writeFile(
    resolve(outputDirectory, `profile-${language}-mobile.svg`),
    renderProfile(language, fetchedRows, true),
  );
}
