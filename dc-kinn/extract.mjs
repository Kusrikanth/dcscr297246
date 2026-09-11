// Extracts self-contained module apps (HRMS / Ticketing / Transport) from the
// digital-campus-sharing project into ./dc-kinn/<app>. The source project is
// never modified. Re-run any time: node dc-kinn/extract.mjs [hrms|ticketing|transport]
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(path.join(ROOT, "package.json"));
const ts = require("typescript");
const SRC = path.join(ROOT, "src");
const OUT_BASE = path.dirname(fileURLToPath(import.meta.url));

const HRMS_ROLES = ["HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN"];
const TRANSPORT_ROLES = ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"];

const APPS = [
  {
    dir: "hrms", pkgName: "dc-kinn-hrms", title: "Digital Caampus - HRMS", port: 4001,
    landing: "/employee-management",
    menuIds: ["hrms"],
    redirects: [["/hrms", "/employee-management"]],
    routes: [
      "/employee-management",
      "/employee-management/add-employee",
      "/employee-management/edit-employee/:employeeId",
      "/employee-monthly-attendance",
      "/other-employee",
      "/other-employee/add-other-employee",
      "/other-employee/edit-employee/:employeeId",
      "/company-details",
      "/bulk-upload",
      "/bulk-upload/raw-data",
      "/profile",
    ],
    publicRoutes: [],
  },
  {
    dir: "ticketing", pkgName: "dc-kinn-ticketing", title: "Digital Caampus - Ticketing", port: 4002,
    landing: "/concerns-feedback",
    menuIds: ["concern-feedback"],
    redirects: [["/helpdesk", "/concerns-feedback"]],
    routes: [
      "/my-concerns",
      "/concerns-feedback",
      "/dc-erp-issues",
      "/concerns-from-app",
      "/my-concerns-feedback",
      "/concerns-feedback/add-concerns-feedback",
      "/concerns-feedback/view-concerns-feedback",
      "/complaint-department",
      "/master-department",
      "/concerns-to-parent",
      "/feedbacks-rating",
      "/concerns-to-parent/add-concern-to-parent",
      "/concerns-to-parent/view-concern-to-parent",
      "/concerns-from-school",
      "/concerns-from-school/view-concern-from-school",
      "/profile",
    ],
    publicRoutes: ["/feedback-form", "/feedback-thank-you-page"],
  },
  {
    dir: "transport", pkgName: "dc-kinn-transport", title: "Digital Caampus - Transport", port: 4003,
    landing: "/transportation-dashboard",
    menuIds: ["transportation"],
    redirects: [["/transport", "/transportation-dashboard"]],
    routes: [
      "/transportation-dashboard",
      "/transportation-settings",
      "/live-tracking",
      "/create-stop",
      "/transportation-settings/all-stops/create-stop",
      "/transport-concession",
      "/transport-concession/create-transport-concession",
      "/transport-concession/edit-transport-concession",
      "/transportation-records",
      "/transportation-employee",
      "/transport-registration",
      "/transportation-employee/add",
      "/transportation-employee/edit/:employeeId",
      "/all-transportation-records",
      "/transportation-tcapproval",
      "/create-change-request",
      "/create-termination-request",
      "/create-new-request/:transportRequestId?",
      "/create-change-request/:transportRequestId?",
      "/transportation-settings/routes-tab",
      "/transportation-settings/all-stops",
      "/transportation-settings/slabs",
      "/transportation-settings/create-stop",
      "/transportation-settings/vehicles-types",
      "/transportation-settings/vehicles-details",
      "/transportation-settings/vehicles-manufacture",
      "/transportation-settings/assign-employee",
      "/transportation-settings/slabs-terms",
      "/transportation-management",
      "/profile",
    ],
    publicRoutes: [],
  },
];

// Reducers every app needs regardless of what the pages reference: the auth /
// layout / institute-context slices the shell (Header, Sidebar, login) relies on.
const BASE_REDUCER_KEYS = [
  "Layout", "Profile", "login", "appData", "globalData", "masterData",
  "branch", "instituteInfo", "instAcademics", "branchInfo", "branchAcademics",
];
const BASE_SAGA_NAMES = ["LayoutSaga", "loginSaga", "masterDataSaga"];

// ---------------------------------------------------------------- helpers
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");
const read = (p) => fs.readFileSync(p, "utf8");
const exists = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const CODE_EXT = /\.(ts|tsx|js|jsx)$/;
const STYLE_EXT = /\.(scss|css)$/;

function parse(file, text) {
  const kind = /\.tsx$/.test(file) ? ts.ScriptKind.TSX
    : /\.ts$/.test(file) ? ts.ScriptKind.TS
    : ts.ScriptKind.JSX;
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, kind);
}

function getProp(obj, name) {
  return obj.properties.find((p) => p.name && p.name.getText() === name);
}
function stringsOf(node) {
  if (!node) return [];
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return [node.text];
  if (ts.isArrayLiteralExpression(node)) return node.elements.flatMap(stringsOf);
  return [];
}
function walk(node, fn) { fn(node); node.forEachChild((c) => walk(c, fn)); }

// ---------------------------------------------------------------- routes
function buildRoutes(app) {
  const file = path.join(SRC, "Routes/allRoutes.tsx");
  const sf = parse(file, read(file));
  const allow = {
    authProtectedRoutes: new Set(app.routes),
    publicRoutes: new Set(app.publicRoutes),
    authRoutesV1: "all",        // /login, /forgotpassword, /validateotp, /resetpassword
    authRoutes: "none",
    authRoutesBlankLayout: "none",
    authProtectedBlankLayout: "none",
  };
  const lazies = new Map();
  const arrays = [];
  let importText = "", exportText = "";
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) importText += st.getText(sf) + "\n";
    else if (ts.isExportDeclaration(st)) exportText = st.getText(sf);
    else if (ts.isVariableStatement(st)) {
      const d = st.declarationList.declarations[0];
      const init = d.initializer;
      if (init && ts.isArrayLiteralExpression(init)) {
        arrays.push({ name: d.name.getText(sf), node: init, typeText: d.type ? ": " + d.type.getText(sf) : "" });
      } else lazies.set(d.name.getText(sf), st.getText(sf));
    } else throw new Error("Unexpected statement in allRoutes.tsx: " + ts.SyntaxKind[st.kind]);
  }
  const usedIds = new Set(), roles = new Set(), matched = new Set();
  const out = [];
  for (const { name, node, typeText } of arrays) {
    const rule = allow[name];
    if (rule === undefined) throw new Error("Unknown route array " + name);
    const kept = [];
    for (const el of node.elements) {
      if (!ts.isObjectLiteralExpression(el)) { console.warn(`  [routes] skipping non-object element in ${name}`); continue; }
      const paths = stringsOf(getProp(el, "path")?.initializer);
      const keep = rule === "all" || (rule !== "none" && paths.some((p) => rule.has(p)));
      if (!keep) continue;
      paths.forEach((p) => matched.add(p));
      kept.push(el.getText(sf));
      walk(el, (n) => { if (ts.isIdentifier(n)) usedIds.add(n.text); });
      stringsOf(getProp(el, "allowedRoles")?.initializer).forEach((r) => roles.add(r));
    }
    out.push({ name, typeText, kept });
  }
  const missing = [...app.routes, ...app.publicRoutes].filter((r) => !matched.has(r));
  if (missing.length) throw new Error(`[${app.dir}] routes not found in allRoutes.tsx: ${missing.join(", ")}`);

  const roleList = JSON.stringify([...roles]);
  const protectedArr = out.find((a) => a.name === "authProtectedRoutes");
  for (const [from, to] of app.redirects) {
    protectedArr.kept.push(`{\n    path: "${from}",\n    component: () => <Redirect to="${to}" />,\n    allowedRoles: ${roleList}\n  }`);
  }
  const lazyText = [...lazies].filter(([n]) => usedIds.has(n)).map(([, t]) => t).join("\n");
  const arraysText = out.map(({ name, typeText, kept }) =>
    `const ${name}${typeText} = [\n${kept.map((k) => "  " + k).join(",\n")}\n];`).join("\n\n");
  return `${importText}import { Redirect } from "react-router-dom";\n\n${lazyText}\n\n${arraysText}\n\n${exportText}\n`;
}

// ---------------------------------------------------------------- menu
function importBindings(imp) {
  const names = [];
  const c = imp.importClause;
  if (!c) return names;
  if (c.name) names.push(c.name.text);
  if (c.namedBindings) {
    if (ts.isNamespaceImport(c.namedBindings)) names.push(c.namedBindings.name.text);
    else c.namedBindings.elements.forEach((e) => names.push(e.name.text));
  }
  return names;
}
function buildMenu(app) {
  const file = path.join(SRC, "Layouts/LayoutMenuData.jsx");
  const text = read(file);
  const sf = parse(file, text);
  const fn = sf.statements.find((s) => ts.isFunctionDeclaration(s) && s.name?.text === "generateMenuOptions");
  const ret = fn.body.statements.find(ts.isReturnStatement);
  let arr = ret.expression;
  while (ts.isParenthesizedExpression(arr)) arr = arr.expression;
  if (!ts.isArrayLiteralExpression(arr)) throw new Error("generateMenuOptions does not return an array literal");
  const kept = arr.elements.filter((el) => ts.isObjectLiteralExpression(el)
    && app.menuIds.includes(stringsOf(getProp(el, "id")?.initializer)[0]));
  if (!kept.length) throw new Error(`[${app.dir}] no menu entries matched ${app.menuIds}`);
  const firstFn = sf.statements.find(ts.isFunctionDeclaration);
  const body = text.slice(firstFn.getFullStart(), arr.getStart(sf) + 1)
    + "\n" + kept.map((el) => "    " + el.getText(sf)).join(",\n") + "\n  "
    + text.slice(arr.end - 1);
  const imports = sf.statements.filter(ts.isImportDeclaration).filter((imp) => {
    const names = importBindings(imp);
    return names.length === 0 || names.some((n) => new RegExp("\\b" + escapeRe(n) + "\\b").test(body));
  });
  return imports.map((i) => i.getText(sf)).join("\n") + "\n" + body;
}

// ---------------------------------------------------------------- store
function parseStoreRegistry() {
  const rf = path.join(SRC, "store/reducers.ts");
  const rsf = parse(rf, read(rf));
  const reducerImports = new Map(); // key -> { spec, text }
  let combineImport = "";
  for (const st of rsf.statements) {
    if (!ts.isImportDeclaration(st)) continue;
    const name = st.importClause?.name?.text;
    if (name) reducerImports.set(name, { spec: st.moduleSpecifier.text, text: st.getText(rsf) });
    else combineImport = st.getText(rsf);
  }
  let keys = [];
  walk(rsf, (n) => {
    if (ts.isCallExpression(n) && n.expression.getText(rsf) === "combineReducers") {
      const obj = n.arguments[0];
      keys = obj.properties.map((p) => {
        if (!ts.isShorthandPropertyAssignment(p)) throw new Error("Non-shorthand reducer key: " + p.getText(rsf));
        return p.name.text;
      });
    }
  });
  keys.forEach((k) => { if (!reducerImports.has(k)) throw new Error("reducer key without import: " + k); });

  const sfile = path.join(SRC, "store/sagas.ts");
  const ssf = parse(sfile, read(sfile));
  const sagaImports = new Map(); // name -> { spec, text }
  let effectsImport = "";
  for (const st of ssf.statements) {
    if (!ts.isImportDeclaration(st)) continue;
    const name = st.importClause?.name?.text;
    if (name) sagaImports.set(name, { spec: st.moduleSpecifier.text, text: st.getText(ssf) });
    else effectsImport = st.getText(ssf);
  }
  const forks = [];
  walk(ssf, (n) => {
    if (ts.isCallExpression(n) && n.expression.getText(ssf) === "fork") forks.push(n.arguments[0].getText(ssf));
  });
  return { reducerImports, keys, combineImport, sagaImports, forks, effectsImport };
}

function buildStore(reg, keys) {
  const keptKeys = reg.keys.filter((k) => keys.has(k));
  const dirs = new Set(keptKeys.map((k) => path.posix.dirname(reg.reducerImports.get(k).spec)));
  const reducers = `${reg.combineImport}\n\n`
    + keptKeys.map((k) => reg.reducerImports.get(k).text).join("\n")
    + `\n\nconst rootReducer = combineReducers({\n${keptKeys.map((k) => "    " + k + ",").join("\n")}\n});\n\nexport default rootReducer;\n`;
  const keptForks = reg.forks.filter((f) => BASE_SAGA_NAMES.includes(f)
    || dirs.has(path.posix.dirname(reg.sagaImports.get(f).spec)));
  const sagas = `${reg.effectsImport}\n\n`
    + keptForks.map((f) => reg.sagaImports.get(f).text).join("\n")
    + `\n\nexport default function* rootSaga() {\n  yield all([\n${keptForks.map((f) => "    fork(" + f + "),").join("\n")}\n  ]);\n}\n`;
  return { reducers, sagas, keptKeys, keptForks };
}

// Which reducer keys does a file read? Looks at useAppSelector/useSelector
// destructuring and state.<key> / getState().<key> access.
function detectKeys(text, allKeys) {
  const found = new Set();
  const consider = (name) => { if (allKeys.has(name)) found.add(name); };
  for (const m of text.matchAll(/use(?:App)?Selector\(\s*\(\s*\{([^}]*)\}/g)) {
    m[1].split(",").forEach((part) => consider(part.split(":")[0].trim()));
  }
  for (const m of text.matchAll(/\b(?:state|getState\(\))\.([A-Za-z_$][\w$]*)/g)) consider(m[1]);
  for (const m of text.matchAll(/\bstate\[\s*['"]([^'"]+)['"]\s*\]/g)) consider(m[1]);
  return found;
}

// ---------------------------------------------------------------- graph
const EXTS = [".ts", ".tsx", ".js", ".jsx", ".json", ".scss", ".css", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp"];
function resolveSpec(fromFile, spec) {
  spec = spec.split("?")[0].split("#")[0].trim();
  if (!spec) return null;
  let base;
  if (spec.startsWith("/src/")) base = path.join(ROOT, spec.slice(1));
  else if (spec.startsWith("/")) return null;            // served from public/ (copied wholesale)
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null;                                       // bare package specifier
  if (base.split(path.sep).includes("node_modules")) return null;
  const cands = [];
  if (STYLE_EXT.test(fromFile)) {
    const d = path.dirname(base), b = path.basename(base);
    cands.push(base, base + ".scss", base + ".css", path.join(d, "_" + b + ".scss"), path.join(d, "_" + b),
      path.join(base, "_index.scss"), path.join(base, "index.scss"));
  } else {
    cands.push(base, ...EXTS.map((e) => base + e),
      ...["index.ts", "index.tsx", "index.js", "index.jsx"].map((i) => path.join(base, i)));
  }
  for (const c of cands) if (exists(c)) return c;
  return false;
}

function extractSpecs(file, text) {
  const specs = [];
  if (CODE_EXT.test(file)) {
    const sf = parse(file, text);
    walk(sf, (n) => {
      if ((ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) && n.moduleSpecifier && ts.isStringLiteral(n.moduleSpecifier)) {
        specs.push(n.moduleSpecifier.text);
      } else if (ts.isCallExpression(n)) {
        const isImport = n.expression.kind === ts.SyntaxKind.ImportKeyword;
        const isRequire = ts.isIdentifier(n.expression) && n.expression.text === "require";
        const a = n.arguments[0];
        if ((isImport || isRequire) && a && (ts.isStringLiteral(a) || ts.isNoSubstitutionTemplateLiteral(a))) specs.push(a.text);
      }
    });
  } else if (STYLE_EXT.test(file)) {
    for (const m of text.matchAll(/@(?:import|use|forward)\s+([^;]+);/g)) {
      for (const part of m[1].split(",")) {
        const s = part.trim().replace(/^['"]|['"]$/g, "").replace(/\s+(as|with)\s+.*$/, "").replace(/['"]$/, "");
        if (s && !s.startsWith("url(") && !/^https?:/.test(s) && !s.startsWith("sass:")) specs.push(s);
      }
    }
    for (const m of text.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
      const u = m[1].trim();
      if (!/^(data:|https?:|\/\/|#|\$)/.test(u) && !u.includes("#{")) specs.push(u);
    }
  }
  return specs;
}

function traverse(entries, overrides) {
  const visited = new Set();
  const unresolved = [];
  const queue = [...entries];
  while (queue.length) {
    const f = queue.pop();
    if (visited.has(f)) continue;
    visited.add(f);
    if (!CODE_EXT.test(f) && !STYLE_EXT.test(f)) continue;
    const r = rel(f);
    const text = overrides.has(r) ? overrides.get(r) : read(f);
    for (const spec of extractSpecs(f, text)) {
      const res = resolveSpec(f, spec);
      if (res === null) continue;
      if (res === false) { unresolved.push({ from: r, spec }); continue; }
      if (!visited.has(res)) queue.push(res);
    }
  }
  return { files: visited, unresolved };
}

function listFiles(dir) {
  const out = [];
  (function rec(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) rec(p); else out.push(p);
    }
  })(dir);
  return out;
}

// ---------------------------------------------------------------- emit
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
function writeFile(dest, text) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, text);
}

function extractApp(app, reg) {
  console.log(`\n=== ${app.dir} ===`);
  const outDir = path.join(OUT_BASE, app.dir);
  for (const d of ["src", "public", "env"]) fs.rmSync(path.join(outDir, d), { recursive: true, force: true });

  const overrides = new Map();
  overrides.set("src/Routes/allRoutes.tsx", buildRoutes(app));
  overrides.set("src/Layouts/LayoutMenuData.jsx", buildMenu(app));

  // Post-login landing: send users to the module instead of /profile.
  const loginRel = "src/pages/AuthV1/Login/index.tsx";
  const loginSrc = read(path.join(ROOT, loginRel));
  const needle = "history.push('/profile')";
  if (loginSrc.split(needle).length !== 2) throw new Error("expected exactly one post-login push in " + loginRel);
  overrides.set(loginRel, loginSrc.replace(needle, `history.push('${app.landing}')`));

  // Fixed point: the reducers an app needs depend on which files get pulled in,
  // and which files get pulled in depends on the reducers registered.
  const allKeys = new Set(reg.keys);
  const keys = new Set(BASE_REDUCER_KEYS);
  let files, unresolved, store;
  for (let i = 0; i < 10; i++) {
    store = buildStore(reg, keys);
    overrides.set("src/store/reducers.ts", store.reducers);
    overrides.set("src/store/sagas.ts", store.sagas);
    ({ files, unresolved } = traverse([path.join(SRC, "index.tsx")], overrides));
    const found = new Set();
    for (const f of files) {
      if (!CODE_EXT.test(f)) continue;
      const r = rel(f);
      if (r === "src/store/reducers.ts" || r === "src/store/sagas.ts") continue;
      detectKeys(overrides.has(r) ? overrides.get(r) : read(f), allKeys).forEach((k) => found.add(k));
    }
    const added = [...found].filter((k) => !keys.has(k));
    if (!added.length) break;
    added.forEach((k) => keys.add(k));
    console.log(`  pass ${i + 1}: +reducers ${added.join(", ")}`);
  }

  // Emit reachable files.
  for (const f of files) {
    const r = rel(f);
    const dest = path.join(outDir, r);
    if (overrides.has(r)) writeFile(dest, overrides.get(r)); else copyFile(f, dest);
  }
  for (const [r, text] of overrides) writeFile(path.join(outDir, r), text);

  // Wholesale: theme SCSS (partials reference each other via variables), ambient
  // types, public/. Then resolve url() assets referenced from the theme.
  const wholesale = ["src/assets/scss", "src/assets/css", "src/types", "public"];
  for (const w of wholesale) {
    const abs = path.join(ROOT, w);
    if (!fs.existsSync(abs)) continue;
    for (const f of listFiles(abs)) copyFile(f, path.join(outDir, rel(f)));
  }
  for (const f of listFiles(SRC).filter((p) => p.endsWith(".d.ts") && path.dirname(p) === SRC)) copyFile(f, path.join(outDir, rel(f)));
  const styleFiles = listFiles(path.join(SRC, "assets/scss")).concat(listFiles(path.join(SRC, "assets/css")));
  const assetUnresolved = [];
  for (const sfile of styleFiles.filter((p) => STYLE_EXT.test(p))) {
    for (const spec of extractSpecs(sfile, read(sfile))) {
      const res = resolveSpec(sfile, spec);
      if (res === false) assetUnresolved.push({ from: rel(sfile), spec });
      else if (res) copyFile(res, path.join(outDir, rel(res)));
    }
  }

  // Project config.
  for (const c of ["tsconfig.json", "tsconfig.app.json", "tsconfig.node.json", "tailwind.config.js",
    "postcss.config.js", "eslint.config.js", ".gitignore", ".npmrc", "env/.env.development"]) {
    if (fs.existsSync(path.join(ROOT, c))) copyFile(path.join(ROOT, c), path.join(outDir, c));
  }
  const pkg = JSON.parse(read(path.join(ROOT, "package.json")));
  pkg.name = app.pkgName;
  pkg.scripts = { ...pkg.scripts, build: "env-cmd -f ./env/.env.development vite build", preview: "vite preview" };
  writeFile(path.join(outDir, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
  const vite = read(path.join(ROOT, "vite.config.ts"));
  if (!/port:\s*4000/.test(vite)) throw new Error("vite.config.ts port not found");
  writeFile(path.join(outDir, "vite.config.ts"), vite.replace(/port:\s*4000/, `port: ${app.port}`));
  const html = read(path.join(ROOT, "index.html"));
  writeFile(path.join(outDir, "index.html"), html.replace(/<title>[^<]*<\/title>/, `<title>${app.title}</title>`));

  const codeCount = [...files].filter((f) => CODE_EXT.test(f)).length;
  console.log(`  files: ${files.size} reachable (${codeCount} code), reducers: ${store.keptKeys.length}, sagas: ${store.keptForks.length}`);
  console.log(`  reducers: ${store.keptKeys.join(", ")}`);
  if (unresolved.length) {
    console.log(`  UNRESOLVED imports (${unresolved.length}):`);
    unresolved.forEach((u) => console.log(`    ${u.from} -> ${u.spec}`));
  }
  if (assetUnresolved.length) {
    console.log(`  unresolved theme url() (${assetUnresolved.length}):`);
    assetUnresolved.forEach((u) => console.log(`    ${u.from} -> ${u.spec}`));
  }
  return { files: files.size, unresolved: unresolved.length };
}

const reg = parseStoreRegistry();
const only = process.argv.slice(2);
for (const app of APPS) {
  if (only.length && !only.includes(app.dir)) continue;
  extractApp(app, reg);
}
console.log("\ndone");
