// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
import * as concurrent from './concurrent.js'
import * as crypto from './crypto.js'
import * as fandoc from './fandoc.js'
import * as inet from './inet.js'
import * as markdown from './markdown.js'
import * as rdf from './rdf.js'
import * as syntax from './syntax.js'
import * as util from './util.js'
import * as web from './web.js'
import * as compilerDoc from './compilerDoc.js'
import * as xeto from './xeto.js'
import * as haystack from './haystack.js'
import * as axon from './axon.js'
import * as def from './def.js'
import * as defc from './defc.js'
import * as xetoEnv from './xetoEnv.js'
import * as xetoDoc from './xetoDoc.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
class XetoCmd extends util.AbstractMain {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return XetoCmd.type$; }

  static find(name) {
    const this$ = this;
    return XetoCmd.list().find((cmd) => {
      return (sys.ObjUtil.equals(cmd.name(), name) || cmd.aliases().contains(name));
    });
  }

  static list() {
    const this$ = this;
    let acc = sys.List.make(XetoCmd.type$);
    XetoCmd.type$.pod().types().each((t) => {
      if ((t.fits(XetoCmd.type$) && !t.isAbstract())) {
        acc.add(sys.ObjUtil.coerce(t.make(), XetoCmd.type$));
      }
      ;
      return;
    });
    sys.Env.cur().index("xeto.cmd").each((qname) => {
      try {
        let type = sys.Type.find(qname);
        let cmd = sys.ObjUtil.coerce(type.make(), XetoCmd.type$);
        acc.add(cmd);
      }
      catch ($_u0) {
        $_u0 = sys.Err.make($_u0);
        if ($_u0 instanceof sys.Err) {
          let e = $_u0;
          ;
          sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus("ERROR: invalid xeto.cmd ", qname), "\n  "), e));
        }
        else {
          throw $_u0;
        }
      }
      ;
      return;
    });
    acc.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    return acc;
  }

  appName() {
    return sys.Str.plus("xeto ", this.name());
  }

  log() {
    return sys.Log.get("xeto");
  }

  aliases() {
    return sys.List.make(sys.Str.type$);
  }

  names() {
    return sys.List.make(sys.Str.type$, [this.name()]).addAll(this.aliases());
  }

  readInputFile(file) {
    if ((file == null || !file.exists())) {
      throw sys.Err.make(sys.Str.plus("Input file does not exist: ", file));
    }
    ;
    let $_u1 = file.ext();
    if (sys.ObjUtil.equals($_u1, "trio")) {
      return haystack.TrioReader.make(file.in()).readAllDicts();
    }
    else if (sys.ObjUtil.equals($_u1, "zinc")) {
      return haystack.Etc.toRecs(haystack.ZincReader.make(file.in()).readVal());
    }
    else if (sys.ObjUtil.equals($_u1, "json")) {
      return haystack.Etc.toRecs(haystack.JsonReader.make(file.in()).readVal());
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unsupported input file extension: ", file));
    }
    ;
  }

  writeOutputFile(file,grid) {
    let buf = sys.StrBuf.make();
    let out = buf.out();
    let $_u2 = file.ext();
    if (sys.ObjUtil.equals($_u2, "trio")) {
      sys.ObjUtil.coerce(haystack.TrioWriter.make(out).writeGrid(grid), haystack.TrioWriter.type$).close();
    }
    else if (sys.ObjUtil.equals($_u2, "zinc")) {
      sys.ObjUtil.coerce(haystack.ZincWriter.make(out).writeGrid(grid), haystack.ZincWriter.type$).close();
    }
    else if (sys.ObjUtil.equals($_u2, "json")) {
      sys.ObjUtil.coerce(haystack.JsonWriter.make(out).writeGrid(grid), haystack.JsonWriter.type$).close();
    }
    else {
      throw sys.Err.make(sys.Str.plus("Unsupported input file extension: ", file));
    }
    ;
    let str = buf.toStr();
    file.out().print(str).close();
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Wrote Output [", file.osPath()), "]"));
    return;
  }

  printLine(line) {
    if (line === undefined) line = "";
    sys.ObjUtil.echo(line);
    return;
  }

  err(msg) {
    this.printLine(sys.Str.plus("ERROR: ", msg));
    return 1;
  }

  withOut(arg,f) {
    if (arg == null) {
      sys.Func.call(f, sys.Env.cur().out());
    }
    else {
      this.printLine(sys.Str.plus(sys.Str.plus("Write [", arg.osPath()), "]"));
      let out = arg.out();
      try {
        sys.Func.call(f, out);
      }
      finally {
        out.close();
      }
      ;
    }
    ;
    return;
  }

  promptConfirm(msg) {
    let res = sys.Env.cur().prompt(sys.Str.plus(sys.Str.plus("", msg), " (y/n)> "));
    if (sys.ObjUtil.equals(sys.Str.lower(res), "y")) {
      return true;
    }
    ;
    return false;
  }

  static make() {
    const $self = new XetoCmd();
    XetoCmd.make$($self);
    return $self;
  }

  static make$($self) {
    util.AbstractMain.make$($self);
    return;
  }

}

class SrcLibCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return SrcLibCmd.type$; }

  #all = false;

  all(it) {
    if (it === undefined) {
      return this.#all;
    }
    else {
      this.#all = it;
      return;
    }
  }

  #allIn = null;

  allIn(it) {
    if (it === undefined) {
      return this.#allIn;
    }
    else {
      this.#allIn = it;
      return;
    }
  }

  #libs = null;

  libs(it) {
    if (it === undefined) {
      return this.#libs;
    }
    else {
      this.#libs = it;
      return;
    }
  }

  name() {
    return "build";
  }

  summary() {
    return "Compile xeto source to xetolib";
  }

  run() {
    const this$ = this;
    let repo = xeto.LibRepo.cur();
    if ((this.#libs == null && this.#allIn == null)) {
      this.#all = true;
    }
    ;
    if (this.#all) {
      this.#allIn = sys.Env.cur().workDir();
    }
    ;
    if (this.#allIn != null) {
      let vers = sys.List.make(xeto.LibVersion.type$);
      let inOsPath = this.#allIn.normalize().pathStr();
      repo.libs().each((libName) => {
        let ver = repo.latest(libName, false);
        if (ver == null) {
          return ver;
        }
        ;
        let f = ver.file(false);
        if ((f != null && ver.isSrc() && sys.Str.startsWith(f.normalize().pathStr(), inOsPath))) {
          vers.add(sys.ObjUtil.coerce(ver, xeto.LibVersion.type$));
        }
        ;
        return;
      });
      if (vers.isEmpty()) {
        this.printLine(sys.Str.plus(sys.Str.plus("ERROR: no libs found [", this.#allIn.osPath()), "]"));
        return 0;
      }
      ;
      return this.process(repo, vers);
    }
    ;
    if ((this.#libs == null || this.#libs.isEmpty())) {
      this.printLine("ERROR: no libs specified");
      return 1;
    }
    ;
    let vers = this.#libs.map((x) => {
      let ver = repo.latest(x, false);
      if ((ver == null || !ver.isSrc())) {
        throw sys.Err.make(sys.Str.plus("Lib src not available: ", x));
      }
      ;
      return sys.ObjUtil.coerce(ver, xeto.LibVersion.type$);
    }, xeto.LibVersion.type$);
    return this.process(repo, sys.ObjUtil.coerce(vers, sys.Type.find("xeto::LibVersion[]")));
  }

  static make() {
    const $self = new SrcLibCmd();
    SrcLibCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class BuildCmd extends SrcLibCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return BuildCmd.type$; }

  name() {
    return "build";
  }

  aliases() {
    return sys.List.make(sys.Str.type$, ["b"]);
  }

  summary() {
    return "Compile xeto source to xetolib";
  }

  process(repo,vers) {
    repo.build(vers);
    return 0;
  }

  static make() {
    const $self = new BuildCmd();
    BuildCmd.make$($self);
    return $self;
  }

  static make$($self) {
    SrcLibCmd.make$($self);
    return;
  }

}

class CleanCmd extends SrcLibCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return CleanCmd.type$; }

  name() {
    return "clean";
  }

  summary() {
    return "Delete all xetolib versions for source libs";
  }

  process(repo,vers) {
    const this$ = this;
    vers.each((ver) => {
      this$.clean(ver);
      return;
    });
    return 0;
  }

  clean(v) {
    let libDir = xetoEnv.XetoUtil.srcToLibDir(v);
    this.printLine(sys.Str.plus(sys.Str.plus("Delete [", libDir.osPath()), "]"));
    libDir.delete();
    return 0;
  }

  static make() {
    const $self = new CleanCmd();
    CleanCmd.make$($self);
    return $self;
  }

  static make$($self) {
    SrcLibCmd.make$($self);
    return;
  }

}

class DocCmd extends SrcLibCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return DocCmd.type$; }

  #outDir = null;

  outDir(it) {
    if (it === undefined) {
      return this.#outDir;
    }
    else {
      this.#outDir = it;
      return;
    }
  }

  name() {
    return "doc";
  }

  summary() {
    return "Compile libs to JSON doc AST files";
  }

  process(repo,vers) {
    const this$ = this;
    let depends = vers.map((x) => {
      return x.asDepend();
    }, xeto.LibDepend.type$);
    let flatten = repo.solveDepends(sys.ObjUtil.coerce(depends, sys.Type.find("xeto::LibDepend[]")));
    let ns = repo.createNamespace(flatten);
    let libs = vers.map((v) => {
      return sys.ObjUtil.coerce(ns.lib(v.name()), xeto.Lib.type$);
    }, xeto.Lib.type$);
    let outDir = ((this$) => { let $_u3 = this$.#outDir; if ($_u3 != null) return $_u3; return sys.Env.cur().workDir().plus(sys.Uri.fromStr("doc-xeto/")); })(this);
    let c = xetoDoc.DocCompiler.make((it) => {
      it.__ns(ns);
      it.__libs(sys.ObjUtil.coerce(((this$) => { let $_u4 = sys.ObjUtil.coerce(libs, sys.Type.find("xeto::Lib[]")); if ($_u4 == null) return null; return sys.ObjUtil.toImmutable(sys.ObjUtil.coerce(libs, sys.Type.find("xeto::Lib[]"))); })(this$), sys.Type.find("xeto::Lib[]")));
      it.__outDir(outDir);
      return;
    });
    c.compile();
    return 0;
  }

  static make() {
    const $self = new DocCmd();
    DocCmd.make$($self);
    return $self;
  }

  static make$($self) {
    SrcLibCmd.make$($self);
    return;
  }

}

class InitCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return InitCmd.type$; }

  #dir = null;

  dir(it) {
    if (it === undefined) {
      return this.#dir;
    }
    else {
      this.#dir = it;
      return;
    }
  }

  #noconfirm = false;

  noconfirm(it) {
    if (it === undefined) {
      return this.#noconfirm;
    }
    else {
      this.#noconfirm = it;
      return;
    }
  }

  #libName = null;

  libName(it) {
    if (it === undefined) {
      return this.#libName;
    }
    else {
      this.#libName = it;
      return;
    }
  }

  name() {
    return "init";
  }

  summary() {
    return "Stub out new xeto lib source dir";
  }

  run() {
    let err = xetoEnv.XetoUtil.libNameErr(sys.ObjUtil.coerce(this.#libName, sys.Str.type$));
    if (err != null) {
      throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Invalid lib name ", sys.Str.toCode(this.#libName)), ": "), err));
    }
    ;
    let rootDir = this.toRootDir();
    let libDir = rootDir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", this.#libName), "/")));
    let meta = libDir.plus(sys.Uri.fromStr("lib.xeto"));
    let specs = libDir.plus(sys.Uri.fromStr("specs.xeto"));
    if (meta.exists()) {
      throw sys.Err.make(sys.Str.plus("File already exists: ", meta.osPath()));
    }
    ;
    if (specs.exists()) {
      throw sys.Err.make(sys.Str.plus("File already exists: ", specs.osPath()));
    }
    ;
    sys.ObjUtil.echo();
    sys.ObjUtil.echo("Generate:");
    sys.ObjUtil.echo(sys.Str.plus("  dir:        ", libDir.osPath()));
    sys.ObjUtil.echo(sys.Str.plus("  lib.xeto:   ", meta.osPath()));
    sys.ObjUtil.echo(sys.Str.plus("  specs.xeto: ", specs.osPath()));
    sys.ObjUtil.echo();
    if (!this.#noconfirm) {
      if (!this.promptConfirm("Generate?")) {
        return 1;
      }
      ;
    }
    ;
    this.genMeta(meta);
    this.genSpecs(specs);
    sys.ObjUtil.echo("Complete");
    return 0;
  }

  toRootDir() {
    if (this.#dir != null) {
      return sys.ObjUtil.coerce(this.#dir, sys.File.type$);
    }
    ;
    return sys.Env.cur().workDir().plus(sys.Uri.fromStr("src/xeto/"));
  }

  genMeta(file) {
    let sysVer = xeto.LibNamespace.system().sysLib().version();
    let sysDepend = sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", sys.ObjUtil.coerce(sysVer.major(), sys.Obj.type$.toNullable())), "."), sys.ObjUtil.coerce(sysVer.minor(), sys.Obj.type$.toNullable())), ".x");
    file.out().print(sys.Str.plus(sys.Str.plus("pragma: Lib <\n  doc: \"TODO\"\n  version: \"0.0.1\"\n  depends: {\n    { lib: \"sys\", versions: \"", sysDepend), "\" }\n  }\n  org: {\n    dis: \"TODO\"\n    uri: \"TODO\"\n  }\n>\n ")).close();
    return;
  }

  genSpecs(file) {
    file.out().print("// My spec documentation\nMySpec : Dict {\n}\n").close();
    return;
  }

  static make() {
    const $self = new InitCmd();
    InitCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class ExportCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportCmd.type$; }

  #all = false;

  all(it) {
    if (it === undefined) {
      return this.#all;
    }
    else {
      this.#all = it;
      return;
    }
  }

  #verbose = false;

  verbose(it) {
    if (it === undefined) {
      return this.#verbose;
    }
    else {
      this.#verbose = it;
      return;
    }
  }

  #outDir = null;

  outDir(it) {
    if (it === undefined) {
      return this.#outDir;
    }
    else {
      this.#outDir = it;
      return;
    }
  }

  #outFile = null;

  outFile(it) {
    if (it === undefined) {
      return this.#outFile;
    }
    else {
      this.#outFile = it;
      return;
    }
  }

  #targets = null;

  targets(it) {
    if (it === undefined) {
      return this.#targets;
    }
    else {
      this.#targets = it;
      return;
    }
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    XetoCmd.prototype.usage.call(this, out);
    out.printLine("Targets:");
    out.printLine("  ph.points                   // latest version of lib");
    out.printLine("  ph.points-1.0.43            // specific version of lib");
    out.printLine("  ph.points::RunCmd           // latest version of spec");
    out.printLine("  ph.points-1.0.43::RunCmd    // specific version of spec");
    out.printLine("  ion.icons::apple            // instance in a lib");
    out.printLine("Examples:");
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " sys                   // latest version of lib"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " sys-1.0.3             // specific lib version"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " sys ph ph.points      // multiple libs"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " ph::Rtu               // one spec"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " ph -outFile foo.xeto  // output to file"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " sys ph -outDir myDir  // output each target to file in dir"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " -all -outDir myDir    // output every lib to file in dir"));
    return 1;
  }

  run() {
    const this$ = this;
    if (!this.checkArgs()) {
      return 1;
    }
    ;
    let repo = xeto.LibRepo.cur();
    let targets = this.findTargets(repo);
    if (this.#verbose) {
      this.printLine("\nFind Targets:");
      targets.each((x) => {
        this$.printLine(sys.Str.plus("  ", x));
        return;
      });
    }
    ;
    let ns = this.createNamespace(repo, targets);
    if (this.#verbose) {
      this.printLine("\nCreate Namespace:");
      ns.versions().each((x) => {
        this$.printLine(sys.Str.plus("  ", x));
        return;
      });
    }
    ;
    this.exportTargets(ns, targets);
    return 0;
  }

  checkArgs() {
    if ((this.#outDir != null && this.#outFile != null)) {
      this.err("Cannot specify both outDir and outFile");
      return false;
    }
    ;
    if ((this.#targets == null && !this.#all)) {
      this.err("No targets specified");
      return false;
    }
    ;
    return true;
  }

  findTargets(repo) {
    const this$ = this;
    if (this.#all) {
      return this.findAllTargets(repo);
    }
    ;
    if (this.#targets == null) {
      return sys.List.make(ExportTarget.type$);
    }
    ;
    return sys.ObjUtil.coerce(this.#targets.map((name) => {
      return this$.findTarget(repo, name);
    }, ExportTarget.type$), sys.Type.find("xetoTools::ExportTarget[]"));
  }

  findAllTargets(repo) {
    const this$ = this;
    return sys.ObjUtil.coerce(repo.libs().map((libName) => {
      return this$.findTarget(repo, libName);
    }, ExportTarget.type$), sys.Type.find("xetoTools::ExportTarget[]"));
  }

  findTarget(repo,name) {
    let libName = name;
    let version = null;
    let specName = null;
    if (sys.Str.contains(name, "::")) {
      (libName = sys.ObjUtil.coerce(xetoEnv.XetoUtil.qnameToLib(name), sys.Str.type$));
      (specName = xetoEnv.XetoUtil.qnameToName(name));
    }
    ;
    if (sys.Str.contains(libName, "-")) {
      let dash = sys.Str.index(libName, "-");
      (version = sys.Version.fromStr(sys.Str.getRange(libName, sys.Range.make(sys.Int.plus(sys.ObjUtil.coerce(dash, sys.Int.type$), 1), -1))));
      (libName = sys.Str.getRange(libName, sys.Range.make(0, sys.ObjUtil.coerce(dash, sys.Int.type$), true)));
    }
    ;
    let lib = ((this$) => { if (version == null) return repo.latest(libName); return repo.version(libName, sys.ObjUtil.coerce(version, sys.Version.type$)); })(this);
    return ExportTarget.make(sys.ObjUtil.coerce(lib, xeto.LibVersion.type$), sys.ObjUtil.coerce(specName, sys.Str.type$.toNullable()));
  }

  createNamespace(repo,targets) {
    const this$ = this;
    let depends = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("xeto::LibDepend"));
    targets.each((t) => {
      depends.set(t.lib().name(), t.depend());
      return;
    });
    let versions = repo.solveDepends(depends.vals());
    return repo.createNamespace(versions);
  }

  exportTargets(ns,targets) {
    if (this.#outDir != null) {
      this.exportToDir(ns, targets);
    }
    else {
      this.exportToFile(ns, targets);
    }
    ;
    return;
  }

  exportToDir(ns,targets) {
    const this$ = this;
    targets.each((t) => {
      let name = sys.Str.replace(this$.toFileName(t), "::", "_");
      let file = this$.#outDir.uri().plusSlash().plusName(name).toFile();
      this$.withOut(file, (out) => {
        let ex = this$.initExporter(ns, out);
        ex.start();
        this$.exportTarget(ns, ex, t);
        ex.end();
        return;
      });
      return;
    });
    return;
  }

  exportToFile(ns,targets) {
    const this$ = this;
    this.withOut(this.#outFile, (out) => {
      let ex = this$.initExporter(ns, out);
      ex.start();
      targets.each((t) => {
        this$.exportTarget(ns, ex, t);
        return;
      });
      ex.end();
      return;
    });
    return;
  }

  exportTarget(ns,ex,t) {
    let lib = ns.lib(t.lib().name());
    if (t.specName() == null) {
      ex.lib(sys.ObjUtil.coerce(lib, xeto.Lib.type$));
      return;
    }
    ;
    let spec = lib.spec(sys.ObjUtil.coerce(t.specName(), sys.Str.type$), false);
    if (spec != null) {
      ex.spec(sys.ObjUtil.coerce(spec, xeto.Spec.type$));
      return;
    }
    ;
    let instance = lib.instance(sys.ObjUtil.coerce(t.specName(), sys.Str.type$), false);
    if (instance != null) {
      ex.instance(sys.ObjUtil.coerce(instance, haystack.Dict.type$));
      return;
    }
    ;
    throw sys.Err.make(sys.Str.plus(sys.Str.plus(sys.Str.plus("Unknown spec/instance ", lib.name()), "::"), t.specName()));
  }

  static make() {
    const $self = new ExportCmd();
    ExportCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class ExportTarget extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportTarget.type$; }

  #lib = null;

  lib() { return this.#lib; }

  __lib(it) { if (it === undefined) return this.#lib; else this.#lib = it; }

  #specName = null;

  specName() { return this.#specName; }

  __specName(it) { if (it === undefined) return this.#specName; else this.#specName = it; }

  #depend = null;

  depend() { return this.#depend; }

  __depend(it) { if (it === undefined) return this.#depend; else this.#depend = it; }

  static make(lib,specName) {
    const $self = new ExportTarget();
    ExportTarget.make$($self,lib,specName);
    return $self;
  }

  static make$($self,lib,specName) {
    $self.#lib = lib;
    $self.#specName = specName;
    $self.#depend = sys.ObjUtil.coerce(xeto.LibDepend.make(lib.name(), sys.ObjUtil.coerce(xeto.LibDependVersions.fromVersion(lib.version()), xeto.LibDependVersions.type$)), xeto.LibDepend.type$);
    return;
  }

  toStr() {
    return ((this$) => { if (this$.#specName == null) return sys.ObjUtil.toStr(this$.#lib); return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this$.#lib), "::"), this$.#specName); })(this);
  }

}

class ExportHaystack extends ExportCmd {
  constructor() {
    super();
    const this$ = this;
    return;
  }

  typeof() { return ExportHaystack.type$; }

  #effective = false;

  effective(it) {
    if (it === undefined) {
      return this.#effective;
    }
    else {
      this.#effective = it;
      return;
    }
  }

  #defns$Store = undefined;

  // private field reflection only
  __defns$Store(it) { if (it === undefined) return this.#defns$Store; else this.#defns$Store = it; }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    ExportCmd.prototype.usage.call(this, out);
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " ph::Rtu -effective    // output effective meta and slots"));
    return 1;
  }

  initExporter(ns,out) {
    let opts = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (this.#effective) {
      opts.set("effective", haystack.Marker.val());
    }
    ;
    return xetoEnv.GridExporter.make(sys.ObjUtil.coerce(ns, xetoEnv.MNamespace.type$), out, haystack.Etc.makeDict(opts), this.filetype());
  }

  toFileName(t) {
    return sys.Str.plus(t.toStr(), sys.Str.plus(".", this.filetype().fileExt()));
  }

  defns() {
    if (this.#defns$Store === undefined) {
      this.#defns$Store = this.defns$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#defns$Store, haystack.Namespace.type$);
  }

  static make() {
    const $self = new ExportHaystack();
    ExportHaystack.make$($self);
    return $self;
  }

  static make$($self) {
    ExportCmd.make$($self);
    ;
    return;
  }

  defns$Once() {
    return defc.DefCompiler.make().compileNamespace();
  }

}

class ExportTrio extends ExportHaystack {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportTrio.type$; }

  name() {
    return "export-trio";
  }

  summary() {
    return "Export Xeto to Trio";
  }

  filetype() {
    return sys.ObjUtil.coerce(this.defns().filetype("trio"), haystack.Filetype.type$);
  }

  static make() {
    const $self = new ExportTrio();
    ExportTrio.make$($self);
    return $self;
  }

  static make$($self) {
    ExportHaystack.make$($self);
    return;
  }

}

class ExportZinc extends ExportHaystack {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportZinc.type$; }

  name() {
    return "export-zinc";
  }

  summary() {
    return "Export Xeto to Zinc";
  }

  filetype() {
    return sys.ObjUtil.coerce(this.defns().filetype("zinc"), haystack.Filetype.type$);
  }

  static make() {
    const $self = new ExportZinc();
    ExportZinc.make$($self);
    return $self;
  }

  static make$($self) {
    ExportHaystack.make$($self);
    return;
  }

}

class ExportHayson extends ExportHaystack {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportHayson.type$; }

  name() {
    return "export-hayson";
  }

  summary() {
    return "Export Xeto to Haystack JSON";
  }

  filetype() {
    return sys.ObjUtil.coerce(this.defns().filetype("json"), haystack.Filetype.type$);
  }

  static make() {
    const $self = new ExportHayson();
    ExportHayson.make$($self);
    return $self;
  }

  static make$($self) {
    ExportHaystack.make$($self);
    return;
  }

}

class ExportJson extends ExportCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportJson.type$; }

  #effective = false;

  effective(it) {
    if (it === undefined) {
      return this.#effective;
    }
    else {
      this.#effective = it;
      return;
    }
  }

  name() {
    return "export-json";
  }

  summary() {
    return "Export Xeto to JSON";
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    ExportCmd.prototype.usage.call(this, out);
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " ph::Rtu -effective    // output effective meta and slots"));
    return 1;
  }

  initExporter(ns,out) {
    let opts = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    if (this.#effective) {
      opts.set("effective", haystack.Marker.val());
    }
    ;
    return xetoEnv.JsonExporter.make(sys.ObjUtil.coerce(ns, xetoEnv.MNamespace.type$), out, haystack.Etc.makeDict(opts));
  }

  toFileName(t) {
    return sys.Str.plus(t.toStr(), ".json");
  }

  static make() {
    const $self = new ExportJson();
    ExportJson.make$($self);
    return $self;
  }

  static make$($self) {
    ExportCmd.make$($self);
    return;
  }

}

class ExportRdf extends ExportCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return ExportRdf.type$; }

  name() {
    return "export-rdf";
  }

  summary() {
    return "Export Xeto to RDF";
  }

  initExporter(ns,out) {
    let opts = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    return xetoEnv.RdfExporter.make(sys.ObjUtil.coerce(ns, xetoEnv.MNamespace.type$), out, haystack.Etc.makeDict(opts));
  }

  toFileName(t) {
    return sys.Str.plus(t.toStr(), ".ttl");
  }

  static make() {
    const $self = new ExportRdf();
    ExportRdf.make$($self);
    return $self;
  }

  static make$($self) {
    ExportCmd.make$($self);
    return;
  }

}

class FitsCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FitsCmd.type$; }

  #graph = false;

  graph(it) {
    if (it === undefined) {
      return this.#graph;
    }
    else {
      this.#graph = it;
      return;
    }
  }

  #ignoreRefs = false;

  ignoreRefs(it) {
    if (it === undefined) {
      return this.#ignoreRefs;
    }
    else {
      this.#ignoreRefs = it;
      return;
    }
  }

  #outFile = null;

  outFile(it) {
    if (it === undefined) {
      return this.#outFile;
    }
    else {
      this.#outFile = it;
      return;
    }
  }

  #input = null;

  input(it) {
    if (it === undefined) {
      return this.#input;
    }
    else {
      this.#input = it;
      return;
    }
  }

  #recs = null;

  recs(it) {
    if (it === undefined) {
      return this.#recs;
    }
    else {
      this.#recs = it;
      return;
    }
  }

  #recsById = null;

  recsById(it) {
    if (it === undefined) {
      return this.#recsById;
    }
    else {
      this.#recsById = it;
      return;
    }
  }

  #ns = null;

  ns(it) {
    if (it === undefined) {
      return this.#ns;
    }
    else {
      this.#ns = it;
      return;
    }
  }

  #hits = null;

  hits(it) {
    if (it === undefined) {
      return this.#hits;
    }
    else {
      this.#hits = it;
      return;
    }
  }

  #numOk = 0;

  // private field reflection only
  __numOk(it) { if (it === undefined) return this.#numOk; else this.#numOk = it; }

  #numErr = 0;

  // private field reflection only
  __numErr(it) { if (it === undefined) return this.#numErr; else this.#numErr = it; }

  name() {
    return "fits";
  }

  summary() {
    return "Validate input data against configured specs";
  }

  usage(out) {
    if (out === undefined) out = sys.Env.cur().out();
    XetoCmd.prototype.usage.call(this, out);
    out.printLine("Examples:");
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " recs.zinc            // Validate Zinc input file"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " recs.json            // Validate Hayson input file"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " recs.trio            // Validate Trio input file"));
    out.printLine(sys.Str.plus(sys.Str.plus("  xeto ", this.name()), " recs.trio -graph     // Validate graph queries"));
    return 1;
  }

  run() {
    this.readInput();
    this.loadNamespace();
    this.runFits();
    this.writeOutput();
    return 0;
  }

  readInput() {
    const this$ = this;
    this.#recs = this.readInputFile(this.#input);
    this.#recsById = sys.Map.__fromLiteral([], [], sys.Type.find("haystack::Ref"), sys.Type.find("haystack::Dict"));
    this.#recs.each((rec) => {
      let id = sys.ObjUtil.as(rec.get("id"), haystack.Ref.type$);
      if (id == null) {
        sys.ObjUtil.echo(sys.Str.plus("WARN: input rec missing id: ", rec));
      }
      else {
        this$.#recsById.add(sys.ObjUtil.coerce(id, haystack.Ref.type$), rec);
      }
      ;
      return;
    });
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Read Inputs [", sys.ObjUtil.coerce(this.#recs.size(), sys.Obj.type$.toNullable())), " recs]"));
    return;
  }

  loadNamespace() {
    this.#ns = xeto.LibRepo.cur().createFromData(sys.ObjUtil.coerce(this.#recs, sys.Type.find("xeto::Dict[]")));
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("Load Namesapce [", sys.ObjUtil.coerce(this.#ns.libs().size(), sys.Obj.type$.toNullable())), " libs]"));
    return;
  }

  runFits() {
    const this$ = this;
    this.#hits = sys.List.make(xeto.XetoLogRec.type$);
    let logger = (rec) => {
      this$.#hits.add(rec);
      return;
    };
    let optsMap = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    optsMap.set("explain", sys.Unsafe.make(logger));
    optsMap.set("haystack", haystack.Marker.val());
    if (this.#graph) {
      optsMap.set("graph", haystack.Marker.val());
    }
    ;
    if (this.#ignoreRefs) {
      optsMap.set("ignoreRefs", haystack.Marker.val());
    }
    ;
    let opts = haystack.Etc.makeDict(optsMap);
    this.#recs.each((rec) => {
      let id = rec._id();
      let startSize = this$.#hits.size();
      let specTag = sys.ObjUtil.as(rec.get("spec"), haystack.Ref.type$);
      if (specTag == null) {
        sys.Func.call(logger, sys.ObjUtil.coerce(xeto.XetoLogRec.make(sys.LogLevel.err(), id, "Missing 'spec' ref tag", util.FileLoc.unknown(), null), xeto.XetoLogRec.type$));
        ((this$) => { let $_u7 = this$.#numErr;this$.#numErr = sys.Int.increment(this$.#numErr); return $_u7; })(this$);
        return;
      }
      ;
      let spec = this$.#ns.spec(specTag.id(), false);
      if (spec == null) {
        sys.Func.call(logger, sys.ObjUtil.coerce(xeto.XetoLogRec.make(sys.LogLevel.err(), id, sys.Str.plus("Unknown 'spec' ref: ", specTag), util.FileLoc.unknown(), null), xeto.XetoLogRec.type$));
        ((this$) => { let $_u8 = this$.#numErr;this$.#numErr = sys.Int.increment(this$.#numErr); return $_u8; })(this$);
        return;
      }
      ;
      this$.#ns.fits(FitsCmdContext.make(this$), rec, sys.ObjUtil.coerce(spec, xeto.Spec.type$), opts);
      if (sys.ObjUtil.equals(this$.#hits.size(), startSize)) {
        ((this$) => { let $_u9 = this$.#numOk;this$.#numOk = sys.Int.increment(this$.#numOk); return $_u9; })(this$);
      }
      else {
        ((this$) => { let $_u10 = this$.#numErr;this$.#numErr = sys.Int.increment(this$.#numErr); return $_u10; })(this$);
      }
      ;
      return;
    });
    return;
  }

  writeOutput() {
    if (this.#outFile == null) {
      this.writeConsole(util.Console.cur());
    }
    else {
      this.writeFile();
    }
    ;
    return;
  }

  writeConsole(con) {
    const this$ = this;
    let table = sys.List.make(sys.Type.find("sys::Obj[]"));
    table.add(sys.List.make(sys.Str.type$, ["id", "dis", "msg"]));
    this.#hits.each((hit) => {
      table.add(sys.List.make(sys.Str.type$, [hit.id().id(), hit.id().dis(), hit.msg()]));
      return;
    });
    con.info("");
    con.table(table);
    con.info("");
    con.info(sys.Str.plus("Num recs ok:  ", sys.ObjUtil.coerce(this.#numOk, sys.Obj.type$.toNullable())));
    con.info(sys.Str.plus("Num recs err: ", sys.ObjUtil.coerce(this.#numErr, sys.Obj.type$.toNullable())));
    con.info("");
    return;
  }

  writeFile() {
    const this$ = this;
    let gb = haystack.GridBuilder.make();
    gb.addCol("id").addCol("msg");
    this.#hits.each((hit) => {
      gb.addRow2(hit.id(), hit.msg());
      return;
    });
    this.writeOutputFile(sys.ObjUtil.coerce(this.#outFile, sys.File.type$), gb.toGrid());
    return;
  }

  static make() {
    const $self = new FitsCmd();
    FitsCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class FitsCmdContext extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FitsCmdContext.type$; }

  #cmd = null;

  cmd(it) {
    if (it === undefined) {
      return this.#cmd;
    }
    else {
      this.#cmd = it;
      return;
    }
  }

  static make(cmd) {
    const $self = new FitsCmdContext();
    FitsCmdContext.make$($self,cmd);
    return $self;
  }

  static make$($self,cmd) {
    $self.#cmd = cmd;
    return;
  }

  xetoReadById(id) {
    return this.#cmd.recsById().get(sys.ObjUtil.coerce(id, haystack.Ref.type$));
  }

  xetoReadAllEachWhile(filter,f) {
    throw sys.Err.make();
  }

  xetoIsSpec(spec,rec) {
    throw sys.Err.make();
  }

}

class GenAxon extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return GenAxon.type$; }

  #podName = null;

  podName(it) {
    if (it === undefined) {
      return this.#podName;
    }
    else {
      this.#podName = it;
      return;
    }
  }

  name() {
    return "gen-axon";
  }

  summary() {
    return "Generate Xeto func specs from Axon defined by Trio/Fantom";
  }

  run() {
    if (this.#podName == null) {
      throw sys.Err.make("No pod name specified");
    }
    ;
    let pod = sys.Pod.find(sys.ObjUtil.coerce(this.#podName, sys.Str.type$));
    let acc = sys.List.make(StubFunc.type$);
    let type = this.toFantomType(sys.ObjUtil.coerce(pod, sys.Pod.type$));
    if (type != null) {
      this.reflectType(acc, sys.ObjUtil.coerce(type, sys.Type.type$));
    }
    ;
    this.reflectTrioFiles(acc, sys.ObjUtil.coerce(pod, sys.Pod.type$));
    acc.sort();
    this.writeAll(sys.Env.cur().out(), acc);
    return 0;
  }

  toFantomType(pod) {
    const this$ = this;
    if (sys.ObjUtil.equals(pod.name(), "axon")) {
      return pod.type("CoreLib");
    }
    ;
    let prefix = sys.Str.plus(pod.name(), "::");
    let ext = sys.Env.cur().index("skyarc.lib").find((it) => {
      return sys.Str.startsWith(it, prefix);
    });
    if (ext != null) {
      return sys.Type.find(sys.ObjUtil.coerce(ext, sys.Str.type$));
    }
    ;
    return null;
  }

  reflectType(acc,type) {
    const this$ = this;
    type.methods().each((m) => {
      if (!m.isPublic()) {
        return;
      }
      ;
      if (m.parent() !== type) {
        return;
      }
      ;
      let facet = m.facet(axon.Axon.type$, false);
      if (facet == null) {
        return;
      }
      ;
      acc.add(this$.reflectMethod(m, sys.ObjUtil.coerce(facet, axon.Axon.type$)));
      return;
    });
    return;
  }

  reflectMethod(method,facet) {
    const this$ = this;
    let name = method.name();
    if (sys.ObjUtil.equals(sys.Str.get(name, 0), 95)) {
      (name = sys.Str.getRange(name, sys.Range.make(1, -1)));
    }
    ;
    let doc = method.doc();
    let meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    facet.decode((n,v) => {
      meta.set(n, v);
      return;
    });
    if (method.hasFacet(sys.NoDoc.type$)) {
      meta.set("nodoc", haystack.Marker.val());
    }
    ;
    let params = method.params().map((p) => {
      let paramName = p.name();
      if (sys.ObjUtil.equals(paramName, "returns")) {
        (paramName = "_returns");
      }
      ;
      return this$.reflectParam(paramName, p.type());
    }, StubParam.type$);
    let returns = this.reflectParam("returns", method.returns());
    return StubFunc.make(name, sys.ObjUtil.coerce(doc, sys.Str.type$), haystack.Etc.makeDict(meta), sys.ObjUtil.coerce(params, sys.Type.find("xetoTools::StubParam[]")), returns, null);
  }

  reflectParam(name,type) {
    let sig = type.name();
    if (type.isNullable()) {
      sig = sys.Str.plus(sig, "?");
    }
    ;
    return StubParam.make(name, sig);
  }

  writeAll(out,funcs) {
    const this$ = this;
    funcs.each((func) => {
      out.printLine();
      this$.write(out, func);
      return;
    });
    return;
  }

  write(out,func) {
    const this$ = this;
    let doc = sys.Str.trimToNull(func.doc());
    if (doc != null) {
      sys.Str.splitLines(doc).each((line) => {
        out.printLine(sys.Str.plus("// ", line));
        return;
      });
    }
    ;
    out.print(func.name()).print(": Func");
    if (!func.meta().isEmpty()) {
      out.print(" <");
      let first = true;
      func.meta().each((v,n) => {
        if (first) {
          (first = false);
        }
        else {
          out.print(", ");
        }
        ;
        out.print(n);
        if (v !== haystack.Marker.val()) {
          out.print(":").print(sys.Str.toCode(sys.ObjUtil.toStr(v)));
        }
        ;
        return;
      });
      out.print(">");
    }
    ;
    out.print(" { ");
    let first = true;
    func.params().each((p) => {
      (first = this$.writeParam(out, p, first));
      return;
    });
    (first = this.writeParam(out, func.returns(), first));
    out.printLine(" }");
    if (func.axon() != null) {
      out.printLine("  --- axon");
      sys.Str.splitLines(func.axon()).each((line) => {
        out.printLine(sys.Str.plus("  ", line));
        return;
      });
      out.printLine("  ---");
    }
    ;
    return;
  }

  writeParam(out,p,first) {
    if (!first) {
      out.print(", ");
    }
    ;
    out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus("", p.name()), ": "), p.type()));
    return false;
  }

  reflectTrioFiles(acc,pod) {
    const this$ = this;
    pod.files().each((f) => {
      if ((sys.Str.startsWith(f.pathStr(), "/lib/") && sys.ObjUtil.equals(f.ext(), "trio"))) {
        this$.reflectTrioFile(acc, f);
      }
      ;
      return;
    });
    return;
  }

  reflectTrioFile(acc,f) {
    const this$ = this;
    let recs = haystack.TrioReader.make(f.in()).readAllDicts();
    let loc = axon.Loc.make(f.pathStr());
    recs.each((rec) => {
      if (rec.has("func")) {
        acc.addNotNull(this$.reflectTrioFunc(loc, rec));
      }
      ;
      return;
    });
    return;
  }

  reflectTrioFunc(loc,rec) {
    const this$ = this;
    let name = ((this$) => { let $_u11 = sys.ObjUtil.as(rec.get("name"), sys.Str.type$); if ($_u11 != null) return $_u11; throw sys.Err.make(sys.Str.plus("Func missing name: ", rec)); })(this);
    let $axon = ((this$) => { let $_u12 = sys.ObjUtil.as(rec.get("src"), sys.Str.type$); if ($_u12 != null) return $_u12; throw sys.Err.make(sys.Str.plus("Func missing axon: ", name)); })(this);
    let meta = sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj"));
    let doc = "";
    rec.each((v,n) => {
      if (sys.ObjUtil.equals(n, "name")) {
        return;
      }
      ;
      if (sys.ObjUtil.equals(n, "src")) {
        return;
      }
      ;
      if (sys.ObjUtil.equals(n, "func")) {
        return;
      }
      ;
      if (sys.ObjUtil.equals(n, "doc")) {
        (doc = sys.ObjUtil.toStr(v));
        return;
      }
      ;
      meta.set(n, v);
      return;
    });
    let parser = axon.Parser.make(loc, sys.Str.in($axon));
    let fn = parser.parseTop(sys.ObjUtil.coerce(name, sys.Str.type$));
    let params = fn.params().map((p) => {
      return StubParam.make(p.name(), "Obj?");
    }, StubParam.type$);
    let returns = StubParam.make("returns", "Obj?");
    return StubFunc.make(sys.ObjUtil.coerce(name, sys.Str.type$), doc, haystack.Etc.makeDict(meta), sys.ObjUtil.coerce(params, sys.Type.find("xetoTools::StubParam[]")), returns, $axon);
  }

  static make() {
    const $self = new GenAxon();
    GenAxon.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class StubFunc extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StubFunc.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #doc = null;

  doc() { return this.#doc; }

  __doc(it) { if (it === undefined) return this.#doc; else this.#doc = it; }

  #meta = null;

  meta() { return this.#meta; }

  __meta(it) { if (it === undefined) return this.#meta; else this.#meta = it; }

  #params = null;

  params() { return this.#params; }

  __params(it) { if (it === undefined) return this.#params; else this.#params = it; }

  #returns = null;

  returns() { return this.#returns; }

  __returns(it) { if (it === undefined) return this.#returns; else this.#returns = it; }

  #axon = null;

  axon() { return this.#axon; }

  __axon(it) { if (it === undefined) return this.#axon; else this.#axon = it; }

  static make(name,doc,meta,params,returns,$axon) {
    const $self = new StubFunc();
    StubFunc.make$($self,name,doc,meta,params,returns,$axon);
    return $self;
  }

  static make$($self,name,doc,meta,params,returns,$axon) {
    $self.#name = name;
    $self.#doc = doc;
    $self.#meta = meta;
    $self.#params = sys.ObjUtil.coerce(((this$) => { let $_u13 = params; if ($_u13 == null) return null; return sys.ObjUtil.toImmutable(params); })($self), sys.Type.find("xetoTools::StubParam[]"));
    $self.#returns = returns;
    $self.#axon = $axon;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), "("), this.#params.join(", ")), sys.Str.plus(sys.Str.plus(sys.Str.plus("): ", this.#returns.type()), " "), this.#meta));
  }

}

class StubParam extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return StubParam.type$; }

  #name = null;

  name() { return this.#name; }

  __name(it) { if (it === undefined) return this.#name; else this.#name = it; }

  #type = null;

  type() { return this.#type; }

  __type(it) { if (it === undefined) return this.#type; else this.#type = it; }

  static make(name,type) {
    const $self = new StubParam();
    StubParam.make$($self,name,type);
    return $self;
  }

  static make$($self,name,type) {
    $self.#name = name;
    $self.#type = type;
    return;
  }

  toStr() {
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", this.#name), ": "), this.#type);
  }

}

class AbstractGenCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
    this.#ts = sys.DateTime.now().toLocale("DD-MMM-YYYY");
    return;
  }

  typeof() { return AbstractGenCmd.type$; }

  #ts = null;

  ts() { return this.#ts; }

  __ts(it) { if (it === undefined) return this.#ts; else this.#ts = it; }

  write(uri,cb) {
    let buf = sys.StrBuf.make();
    let out = buf.out();
    out.printLine("//");
    out.printLine("// Copyright (c) 2011-2025, Project-Haystack");
    out.printLine("// Licensed under the Academic Free License version 3.0");
    out.printLine(sys.Str.plus("// Auto-generated ", this.#ts));
    out.printLine("//");
    out.printLine();
    sys.Func.call(cb, out);
    let contents = buf.toStr();
    let file = this.outDir().plus(uri);
    if (AbstractGenCmd.isFileChanged(file, contents)) {
      this.info(sys.Str.plus(sys.Str.plus("write [", file.osPath()), "]"));
      file.out().print(contents).close();
    }
    else {
      this.info(sys.Str.plus(sys.Str.plus(" skip [", file.osPath()), "]"));
    }
    ;
    return;
  }

  static isFileChanged(file,newContents) {
    if (!file.exists()) {
      return true;
    }
    ;
    let oldContents = file.readAllStr();
    let tsLine = 3;
    let newLines = sys.Str.splitLines(sys.Str.trim(newContents));
    let oldLines = sys.Str.splitLines(sys.Str.trim(oldContents));
    if (!sys.Str.contains(newLines.get(tsLine), "Auto-generated")) {
      throw sys.Err.make();
    }
    ;
    newLines.removeRange(sys.Range.make(0, tsLine));
    oldLines.removeRange(sys.Range.make(0, tsLine));
    return sys.ObjUtil.compareNE(newLines, oldLines);
  }

  writeDoc(out,$def) {
    const this$ = this;
    let doc = ((this$) => { let $_u14 = sys.ObjUtil.as($def.get("doc"), sys.Str.type$); if ($_u14 != null) return $_u14; return $def.name(); })(this);
    sys.Str.splitLines(doc).each((line) => {
      out.printLine(sys.Str.trimEnd(sys.Str.plus("// ", line)));
      return;
    });
    return;
  }

  info(msg) {
    sys.ObjUtil.echo(msg);
    return;
  }

  normEnumName(name) {
    if ((sys.Str.startsWith(name, "L") && sys.Int.isDigit(sys.Str.get(name, 1)))) {
      (name = sys.Str.plus("p", name));
    }
    ;
    (name = sys.Str.replace(name, "-", " "));
    (name = sys.Str.replace(name, "/", " "));
    return haystack.Etc.toTagName(name);
  }

  static make() {
    const $self = new AbstractGenCmd();
    AbstractGenCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    ;
    return;
  }

}

class GenTz extends AbstractGenCmd {
  constructor() {
    super();
    const this$ = this;
    this.#outDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("../xeto/src/xeto/sys/")).normalize();
    return;
  }

  typeof() { return GenTz.type$; }

  #outDir = null;

  outDir(it) {
    if (it === undefined) {
      return this.#outDir;
    }
    else {
      this.#outDir = it;
      return;
    }
  }

  name() {
    return "gen-tz";
  }

  summary() {
    return "Generate Xeto sys 'tz.xeto' source code";
  }

  run() {
    const this$ = this;
    if (!this.outDir().plus(sys.Uri.fromStr("types.xeto")).exists()) {
      throw sys.Err.make(sys.Str.plus("Invalid outDir: ", this.outDir()));
    }
    ;
    this.write(sys.Uri.fromStr("timezones.xeto"), (out) => {
      out.printLine("// TimeZone names for standardized database");
      out.printLine("TimeZone: Enum {");
      let names = sys.TimeZone.listNames().dup();
      names.moveTo("UTC", 0);
      names.each((name) => {
        let key = name;
        if (sys.Str.startsWith(key, "GMT-")) {
          (name = sys.Str.plus("gmtMinus", sys.Str.getRange(key, sys.Range.make(4, -1))));
        }
        else {
          if (sys.Str.startsWith(key, "GMT+")) {
            (name = sys.Str.plus("gmtPlus", sys.Str.getRange(key, sys.Range.make(4, -1))));
          }
          else {
            (name = this$.normEnumName(name));
          }
          ;
        }
        ;
        out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", name), " <key:"), sys.Str.toCode(key)), ">"));
        return;
      });
      out.printLine("}");
      return;
    });
    return 0;
  }

  static make() {
    const $self = new GenTz();
    GenTz.make$($self);
    return $self;
  }

  static make$($self) {
    AbstractGenCmd.make$($self);
    ;
    return;
  }

}

class GenUnits extends AbstractGenCmd {
  constructor() {
    super();
    const this$ = this;
    this.#outDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("../xeto/src/xeto/sys/")).normalize();
    return;
  }

  typeof() { return GenUnits.type$; }

  #outDir = null;

  outDir(it) {
    if (it === undefined) {
      return this.#outDir;
    }
    else {
      this.#outDir = it;
      return;
    }
  }

  name() {
    return "gen-units";
  }

  summary() {
    return "Generate Xeto sys 'unit.xeto' source code";
  }

  run() {
    const this$ = this;
    if (!this.outDir().plus(sys.Uri.fromStr("types.xeto")).exists()) {
      throw sys.Err.make(sys.Str.plus("Invalid outDir: ", this.outDir()));
    }
    ;
    let quantities = sys.List.make(sys.Str.type$);
    this.write(sys.Uri.fromStr("units.xeto"), (out) => {
      out.printLine("// Unit symbols for standardized database");
      out.printLine("Unit: Enum {");
      sys.Unit.quantities().each((q) => {
        let quantityMeta = null;
        if (sys.ObjUtil.compareNE(q, "dimensionless")) {
          let quantityName = this$.normEnumName(q);
          quantities.add(quantityName);
          (quantityMeta = sys.Str.plus(", quantity:", sys.Str.toCode(quantityName)));
        }
        ;
        sys.Unit.quantity(q).each((u) => {
          out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", u.name()), " <key:"), sys.Str.toCode(u.symbol())));
          if (quantityMeta != null) {
            out.print(quantityMeta);
          }
          ;
          out.printLine(">");
          return;
        });
        out.printLine();
        return;
      });
      out.printLine("}");
      out.printLine();
      out.printLine("// Unit quantity types for standardized database");
      out.printLine("UnitQuantity: Enum {");
      quantities.each((q) => {
        out.printLine(sys.Str.plus("  ", q));
        return;
      });
      out.printLine("}");
      return;
    });
    return 0;
  }

  static make() {
    const $self = new GenUnits();
    GenUnits.make$($self);
    return $self;
  }

  static make$($self) {
    AbstractGenCmd.make$($self);
    ;
    return;
  }

}

class GenWriter extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
    this.#buf = sys.StrBuf.make();
    return;
  }

  typeof() { return GenWriter.type$; }

  #file = null;

  file() { return this.#file; }

  __file(it) { if (it === undefined) return this.#file; else this.#file = it; }

  #buf = null;

  buf(it) {
    if (it === undefined) {
      return this.#buf;
    }
    else {
      this.#buf = it;
      return;
    }
  }

  static make(file) {
    const $self = new GenWriter();
    GenWriter.make$($self,file);
    return $self;
  }

  static make$($self,file) {
    ;
    $self.#file = file;
    return;
  }

  w(x) {
    this.#buf.add(x);
    return this;
  }

  str(x) {
    if (x == null) {
      (x = "");
    }
    ;
    return this.w(sys.Str.toCode(sys.ObjUtil.toStr(x)));
  }

  nl() {
    return this.w("\n");
  }

  close() {
    this.#file.out().print(this.#buf.toStr()).close();
    return;
  }

}

class GenFantom extends AbstractGenCmd {
  constructor() {
    super();
    const this$ = this;
    this.#workDir = sys.Env.cur().workDir();
    this.#outDir = sys.Env.cur().workDir();
    return;
  }

  typeof() { return GenFantom.type$; }

  #workDir = null;

  workDir(it) {
    if (it === undefined) {
      return this.#workDir;
    }
    else {
      this.#workDir = it;
      return;
    }
  }

  #podNames = null;

  podNames(it) {
    if (it === undefined) {
      return this.#podNames;
    }
    else {
      this.#podNames = it;
      return;
    }
  }

  #outDir = null;

  outDir(it) {
    if (it === undefined) {
      return this.#outDir;
    }
    else {
      this.#outDir = it;
      return;
    }
  }

  #numFiles = 0;

  numFiles(it) {
    if (it === undefined) {
      return this.#numFiles;
    }
    else {
      this.#numFiles = it;
      return;
    }
  }

  name() {
    return "gen-fantom";
  }

  summary() {
    return "Generate Xeto lib of interfaces for Fantom pods";
  }

  run() {
    const this$ = this;
    if ((this.#podNames == null || this.#podNames.isEmpty())) {
      throw sys.Err.make("No pod names specified");
    }
    ;
    let pods = this.#podNames.map((n) => {
      return sys.ObjUtil.coerce(sys.Pod.find(n), sys.Pod.type$);
    }, sys.Pod.type$);
    pods.each((pod) => {
      this$.genPod(sys.ObjUtil.coerce(pod, sys.Pod.type$));
      return;
    });
    return 0;
  }

  genPod(pod) {
    const this$ = this;
    this.outDir(this.#workDir.plus(sys.Str.toUri(sys.Str.plus(sys.Str.plus("src/xeto/fan.", pod.name()), "/"))));
    this.genLibMeta(pod);
    pod.types().dup().sort().each((type) => {
      this$.genType(type);
      return;
    });
    if (sys.ObjUtil.equals(pod.name(), "sys")) {
      this.genSys();
    }
    ;
    sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("Generated '", pod.name()), "' "), sys.ObjUtil.coerce(this.#numFiles, sys.Obj.type$.toNullable())), " files ["), this.outDir().osPath()), "]"));
    return;
  }

  genLibMeta(pod) {
    const this$ = this;
    let out = this.open(sys.Uri.fromStr("lib.xeto"));
    sys.ObjUtil.coerce(out.w("pragma: Lib <"), FantomGenWriter.type$).nl();
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w("  doc: "), FantomGenWriter.type$).str(pod.meta().get("pod.summary")), FantomGenWriter.type$).nl();
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w("  version: "), FantomGenWriter.type$).str(pod.version()), FantomGenWriter.type$).nl();
    sys.ObjUtil.coerce(out.w("  depends: {"), FantomGenWriter.type$).nl();
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w("    { lib: "), FantomGenWriter.type$).str("sys"), FantomGenWriter.type$).w(" }"), FantomGenWriter.type$).nl();
    pod.depends().each((d) => {
      let versions = xeto.LibDependVersions.fromFantomDepend(d);
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w("    { lib: "), FantomGenWriter.type$).str(sys.Str.plus("fan.", d.name())), FantomGenWriter.type$).w(", versions: "), FantomGenWriter.type$).str(versions), FantomGenWriter.type$).w(" }"), FantomGenWriter.type$).nl();
      return;
    });
    sys.ObjUtil.coerce(out.w("  }"), FantomGenWriter.type$).nl();
    let orgDis = ((this$) => { let $_u15 = pod.meta().get("org.name"); if ($_u15 != null) return $_u15; return pod.meta().get("proj.name"); })(this);
    let orgUri = ((this$) => { let $_u16 = pod.meta().get("org.uri"); if ($_u16 != null) return $_u16; return pod.meta().get("proj.uri"); })(this);
    if ((orgDis != null || orgUri != null)) {
      sys.ObjUtil.coerce(out.w("  org: {"), FantomGenWriter.type$).nl();
      if (orgDis != null) {
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w("    dis: "), FantomGenWriter.type$).str(orgDis), FantomGenWriter.type$).nl();
      }
      ;
      if (orgUri != null) {
        sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w("    uri: "), FantomGenWriter.type$).str(orgUri), FantomGenWriter.type$).nl();
      }
      ;
      sys.ObjUtil.coerce(out.w("  }"), FantomGenWriter.type$).nl();
    }
    ;
    sys.ObjUtil.coerce(out.w(">"), FantomGenWriter.type$).nl();
    out.close();
    return;
  }

  genType(x) {
    const this$ = this;
    if (this.skipType(x)) {
      return;
    }
    ;
    let out = this.open(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", x.name()), ".xeto")));
    this.genDoc(out, x.doc(), "");
    sys.ObjUtil.coerce(out.w(x.name()), FantomGenWriter.type$).w(": ");
    let base = x.base();
    if (base != null) {
      out.sig(sys.ObjUtil.coerce(base, sys.Type.type$));
    }
    else {
      out.w("Interface");
    }
    ;
    x.mixins().each((m) => {
      sys.ObjUtil.coerce(out.w(" & "), FantomGenWriter.type$).sig(m);
      return;
    });
    out.meta(this.toTypeMeta(x));
    let slots = x.slots().findAll((slot) => {
      return slot.parent() === x;
    });
    slots.sort();
    if (slots.isEmpty()) {
      out.nl();
    }
    else {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w(" {"), FantomGenWriter.type$).nl(), FantomGenWriter.type$).nl();
      slots.each((slot) => {
        this$.genSlot(out, slot);
        return;
      });
      sys.ObjUtil.coerce(out.w("}"), FantomGenWriter.type$).nl();
    }
    ;
    out.close();
    return;
  }

  skipType(type) {
    if (type.isSynthetic()) {
      return true;
    }
    ;
    if (type.hasFacet(sys.NoDoc.type$)) {
      return true;
    }
    ;
    if (type.isInternal()) {
      return true;
    }
    ;
    if ((type.fits(sys.Test.type$) && sys.ObjUtil.compareNE(type.qname(), "sys::Test"))) {
      return true;
    }
    ;
    return false;
  }

  toTypeMeta(x) {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    if (x.isAbstract()) {
      acc.set("abstract", haystack.Marker.val());
    }
    ;
    if (x.isConst()) {
      acc.set("const", haystack.Marker.val());
    }
    ;
    if (x.isFinal()) {
      acc.set("sealed", haystack.Marker.val());
    }
    ;
    return acc;
  }

  genSlot(out,x) {
    if (this.skipSlot(x)) {
      return;
    }
    ;
    this.genDoc(out, x.doc(), "  ");
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w("  "), FantomGenWriter.type$).w(x.name()), FantomGenWriter.type$).w(": ");
    if (x.isField()) {
      this.genField(out, sys.ObjUtil.coerce(x, sys.Field.type$));
    }
    else {
      this.genMethod(out, sys.ObjUtil.coerce(x, sys.Method.type$));
    }
    ;
    out.nl();
    return;
  }

  skipSlot(slot) {
    if (slot.isSynthetic()) {
      return true;
    }
    ;
    if (slot.isPrivate()) {
      return true;
    }
    ;
    if (slot.isInternal()) {
      return true;
    }
    ;
    if (slot.hasFacet(sys.NoDoc.type$)) {
      return true;
    }
    ;
    return false;
  }

  genField(out,x) {
    out.sig(x.type());
    out.meta(this.toFieldMeta(x));
    out.nl();
    return;
  }

  genMethod(out,x) {
    const this$ = this;
    out.w("sys::Func");
    out.meta(this.toMethodMeta(x));
    out.w(" { ");
    let first = true;
    x.params().each((p) => {
      if (first) {
        (first = false);
      }
      else {
        out.w(", ");
      }
      ;
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w(p.name()), FantomGenWriter.type$).w(": "), FantomGenWriter.type$).sig(p.type());
      return;
    });
    if (!first) {
      out.w(", ");
    }
    ;
    out.w("returns: ");
    if (x.isCtor()) {
      out.w("fan.sys::This");
    }
    else {
      out.sig(x.returns());
    }
    ;
    out.w(" }\n");
    return;
  }

  toFieldMeta(x) {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    if (x.isAbstract()) {
      acc.set("abstract", haystack.Marker.val());
    }
    ;
    if (x.isConst()) {
      acc.set("const", haystack.Marker.val());
    }
    ;
    if (x.isStatic()) {
      acc.set("static", haystack.Marker.val());
    }
    ;
    if (x.isVirtual()) {
      acc.set("virtual", haystack.Marker.val());
    }
    ;
    return acc;
  }

  toMethodMeta(x) {
    const this$ = this;
    let acc = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    if (x.isAbstract()) {
      acc.set("abstract", haystack.Marker.val());
    }
    ;
    if (x.isCtor()) {
      acc.set("new", haystack.Marker.val());
    }
    else {
      if (x.isStatic()) {
        acc.set("static", haystack.Marker.val());
      }
      ;
    }
    ;
    if (x.isVirtual()) {
      acc.set("virtual", haystack.Marker.val());
    }
    ;
    return acc;
  }

  open(filename) {
    ((this$) => { let $_u17 = this$.#numFiles;this$.#numFiles = sys.Int.increment(this$.#numFiles); return $_u17; })(this);
    let file = this.outDir().plus(filename);
    let out = FantomGenWriter.make(file);
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w("// Auto-generated "), FantomGenWriter.type$).w(this.ts()), FantomGenWriter.type$).nl();
    out.nl();
    return out;
  }

  genDoc(out,doc,indent) {
    const this$ = this;
    (doc = ((this$) => { let $_u18 = doc; if ($_u18 == null) return null; return sys.Str.trimToNull(doc); })(this));
    if (doc == null) {
      return;
    }
    ;
    sys.Str.splitLines(doc).each((line) => {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w(indent), FantomGenWriter.type$).w("// "), FantomGenWriter.type$).w(line), FantomGenWriter.type$).nl();
      return;
    });
    return;
  }

  genSys() {
    const this$ = this;
    let out = this.open(sys.Uri.fromStr("sys.xeto"));
    sys.Str.split("A,B,C,D,E,F,G,H,K,L,M,R,V", sys.ObjUtil.coerce(44, sys.Int.type$.toNullable())).each((n) => {
      sys.ObjUtil.coerce(sys.ObjUtil.coerce(out.w(n), FantomGenWriter.type$).w(": Interface"), FantomGenWriter.type$).nl();
      return;
    });
    out.close();
    return;
  }

  static make() {
    const $self = new GenFantom();
    GenFantom.make$($self);
    return $self;
  }

  static make$($self) {
    AbstractGenCmd.make$($self);
    ;
    return;
  }

}

class FantomGenWriter extends GenWriter {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return FantomGenWriter.type$; }

  static make(file) {
    const $self = new FantomGenWriter();
    FantomGenWriter.make$($self,file);
    return $self;
  }

  static make$($self,file) {
    GenWriter.make$($self, file);
    return;
  }

  sig(t) {
    sys.ObjUtil.coerce(sys.ObjUtil.coerce(sys.ObjUtil.coerce(this.w("fan."), FantomGenWriter.type$).w(t.pod().name()), FantomGenWriter.type$).w("::"), FantomGenWriter.type$).w(t.name());
    if (t.isNullable()) {
      this.w("?");
    }
    ;
    return this;
  }

  meta(acc) {
    const this$ = this;
    if (acc.isEmpty()) {
      return this;
    }
    ;
    this.w(" <");
    let first = true;
    acc.each((v,n) => {
      if (first) {
        (first = false);
      }
      else {
        this$.w(", ");
      }
      ;
      this$.w(n);
      if (v !== haystack.Marker.val()) {
        sys.ObjUtil.coerce(this$.w(": "), FantomGenWriter.type$).str(v);
      }
      ;
      return;
    });
    this.w(">");
    return this;
  }

}

class GenPH extends AbstractGenCmd {
  constructor() {
    super();
    const this$ = this;
    this.#outDir = sys.Env.cur().workDir().plus(sys.Uri.fromStr("../xeto/src/xeto/ph/")).normalize();
    this.#defSymbol = sys.ObjUtil.coerce(haystack.Symbol.fromStr("def"), haystack.Symbol.type$);
    return;
  }

  typeof() { return GenPH.type$; }

  #outDir = null;

  outDir(it) {
    if (it === undefined) {
      return this.#outDir;
    }
    else {
      this.#outDir = it;
      return;
    }
  }

  #defSymbol = null;

  // private field reflection only
  __defSymbol(it) { if (it === undefined) return this.#defSymbol; else this.#defSymbol = it; }

  #ns = null;

  // private field reflection only
  __ns(it) { if (it === undefined) return this.#ns; else this.#ns = it; }

  #ph = null;

  // private field reflection only
  __ph(it) { if (it === undefined) return this.#ph; else this.#ph = it; }

  #multiRefs$Store = undefined;

  // private field reflection only
  __multiRefs$Store(it) { if (it === undefined) return this.#multiRefs$Store; else this.#multiRefs$Store = it; }

  name() {
    return "gen-ph";
  }

  summary() {
    return "Generate Xeto ph lib source code from Haystack 4 defs";
  }

  run() {
    this.checkInputs();
    this.compileNamespace();
    this.writeLib();
    this.writeTags();
    this.writeEntities();
    this.writeEnums();
    this.writeChoices();
    this.writeFeatureDefs();
    return 0;
  }

  checkInputs() {
    if (!this.outDir().plus(sys.Uri.fromStr("kinds.xeto")).exists()) {
      throw sys.Err.make(sys.Str.plus("Invalid outDir: ", this.outDir()));
    }
    ;
    return;
  }

  compileNamespace() {
    this.#ns = defc.DefCompiler.make().compileNamespace();
    this.#ph = this.#ns.lib("ph");
    return;
  }

  writeLib() {
    const this$ = this;
    this.write(sys.Uri.fromStr("lib.xeto"), (out) => {
      out.printLine("pragma: Lib <\n  doc: \"Project haystack core library\"\n  version: \"0.1.1\"\n  depends: {\n    { lib: \"sys\", versions: \"0.1.x\" }\n  }\n  org: {\n   dis: \"Project Haystack\"\n   uri: \"https://project-haystack.org/\"\n  }\n>");
      return;
    });
    return;
  }

  writeTags() {
    const this$ = this;
    let tags = sys.List.make(haystack.Def.type$);
    this.#ns.eachDef(($def) => {
      if ($def.symbol().type().isTag()) {
        tags.add($def);
      }
      ;
      return;
    });
    tags.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    this.write(sys.Uri.fromStr("tags.xeto"), (out) => {
      tags.each(($def) => {
        let name = $def.name();
        let kind = this$.#ns.defToKind($def);
        let type = this$.toTagType($def);
        let meta = this$.toTagMeta($def, kind);
        if (this$.excludeTag($def, kind)) {
          return;
        }
        ;
        this$.writeDoc(out, $def);
        out.printLine(sys.Str.trim(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), ": "), type), " "), meta)));
        out.printLine();
        return;
      });
      return;
    });
    return;
  }

  excludeTag($def,kind) {
    let n = $def.name();
    if (sys.ObjUtil.equals(n, sys.Str.decapitalize(kind.name()))) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "doc")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "is")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "mandatory")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "notInherited")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "tagOn")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "transient")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "depends")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "relationship")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "inputs")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "outputs")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "contains")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "containedBy")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "association")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "quantities")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "quantityOf")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "tagOn")) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(n, "tags")) {
      return true;
    }
    ;
    if (this.isAbstract($def.name())) {
      return true;
    }
    ;
    if (sys.ObjUtil.equals(((this$) => { let $_u19 = this$.#ns.supertypes($def).first(); if ($_u19 == null) return null; return this$.#ns.supertypes($def).first().name(); })(this), "choice")) {
      return true;
    }
    ;
    return false;
  }

  toTagType(tag) {
    if ((tag.has("enum") && this.#ns.fits(tag, sys.ObjUtil.coerce(this.#ns.def("str"), haystack.Def.type$)))) {
      return this.toEnumTypeName(tag);
    }
    ;
    if ((sys.Str.endsWith(tag.name(), "Ref") && this.multiRefs().contains(tag.name()))) {
      return "MultiRef";
    }
    ;
    if (tag.has("inputs")) {
      return "MultiRef";
    }
    ;
    if (sys.ObjUtil.equals(tag.name(), "version")) {
      return "Version";
    }
    ;
    return this.#ns.defToKind(tag).name();
  }

  multiRefs() {
    if (this.#multiRefs$Store === undefined) {
      this.#multiRefs$Store = this.multiRefs$Once();
    }
    ;
    return sys.ObjUtil.coerce(this.#multiRefs$Store, sys.Type.find("sys::Str[]"));
  }

  toEnumTypeName(tag) {
    if (sys.ObjUtil.equals(tag.name(), "tz")) {
      return "TimeZone";
    }
    ;
    if (sys.ObjUtil.equals(tag.name(), "weatherCond")) {
      return "WeatherCondEnum";
    }
    ;
    if (sys.ObjUtil.equals(tag.name(), "daytime")) {
      return "WeatherDaytimeEnum";
    }
    ;
    return sys.Str.capitalize(tag.name());
  }

  toChoiceTypeName($def) {
    let simplify = this.choiceSimplify($def);
    if (simplify != null) {
      return sys.ObjUtil.coerce(simplify, sys.Str.type$);
    }
    ;
    return sys.Str.capitalize(xetoEnv.XetoUtil.dottedToCamel($def.name(), 45));
  }

  toTagMeta($def,kind) {
    if (kind.isList()) {
      let of$ = $def.get("of");
      if (of$ != null) {
        let ofName = sys.Str.capitalize(sys.ObjUtil.toStr(of$));
        if (sys.ObjUtil.equals(ofName, "Unit")) {
          (ofName = "Str");
        }
        ;
        if (sys.ObjUtil.equals(ofName, "Phenomenon")) {
          return "";
        }
        ;
        if (sys.ObjUtil.equals(ofName, "MlVarRef")) {
          (ofName = "Ref<of:MlVar>");
        }
        ;
        return sys.Str.plus(sys.Str.plus("<of:", ofName), ">");
      }
      ;
    }
    ;
    if (sys.ObjUtil.equals($def.name(), "area")) {
      return "<quantity:\"area\">";
    }
    ;
    if (kind.isRef()) {
      let of$ = ((this$) => { let $_u20 = $def.get("of"); if ($_u20 == null) return null; return sys.ObjUtil.toStr($def.get("of")); })(this);
      if ((of$ != null && !sys.Str.endsWith(of$, "-output"))) {
        return sys.Str.plus(sys.Str.plus("<of:", sys.Str.capitalize(xetoEnv.XetoUtil.dottedToCamel(sys.Str.toStr(of$), 45))), ">");
      }
      ;
    }
    ;
    return "";
  }

  writeEntities() {
    const this$ = this;
    let entityDef = this.#ns.def("entity");
    let entities = this.#ns.findDefs(($def) => {
      return this$.#ns.fits($def, sys.ObjUtil.coerce(entityDef, haystack.Def.type$));
    });
    entities.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    entities.removeSame(sys.ObjUtil.coerce(entityDef, haystack.Def.type$));
    this.write(sys.Uri.fromStr("entities.xeto"), (out) => {
      entities.each(($def) => {
        if (this$.excludeEntity($def)) {
          return;
        }
        ;
        this$.writeDoc(out, $def);
        let name = this$.toEntityName($def);
        let type = this$.toEntityType($def);
        out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), ": "), type));
        this$.writeEntityMeta(out, $def);
        out.printLine(" {");
        this$.writeEntityUsage(out, $def);
        this$.writeEntitySlots(out, $def);
        out.printLine("}");
        out.printLine();
        return;
      });
      return;
    });
    return;
  }

  toEntityName($def) {
    const this$ = this;
    let symbol = $def.symbol();
    if (symbol.type().isTag()) {
      return sys.Str.capitalize($def.name());
    }
    ;
    let s = sys.StrBuf.make();
    $def.symbol().eachPart((n) => {
      s.add(sys.Str.capitalize(n));
      return;
    });
    return s.toStr();
  }

  toEntityType($def) {
    if (sys.ObjUtil.equals($def.name(), "entity")) {
      return "Dict";
    }
    ;
    let supers = sys.ObjUtil.as($def.get("is"), sys.Type.find("haystack::Symbol[]"));
    return this.toEntityName(sys.ObjUtil.coerce(this.#ns.def(supers.first().toStr()), haystack.Def.type$));
  }

  writeEntityMeta(out,entity) {
    let symbol = entity.symbol();
    let name = symbol.name();
    let special = (sys.ObjUtil.equals(name, "space") || sys.ObjUtil.equals(name, "equip") || sys.ObjUtil.equals(name, "point") || sys.Str.endsWith(name, "-point"));
    if ((!this.isAbstract(name) && !special)) {
      return;
    }
    ;
    out.print(" <abstract>");
    return;
  }

  writeEntityUsage(out,entity) {
    const this$ = this;
    let symbol = entity.symbol();
    let name = symbol.name();
    if (this.isAbstract(name)) {
      return;
    }
    ;
    if (symbol.type().isTag()) {
      out.printLine(sys.Str.plus("  ", symbol));
      return;
    }
    else {
      let bases = this.#ns.supertypes(entity).findAll((x) => {
        return this$.#ns.fits(x, sys.ObjUtil.coerce(this$.#ns.def("entity"), haystack.Def.type$));
      });
      symbol.eachPart((part) => {
        if (bases.any((it) => {
          return it.symbol().hasTermName(part);
        })) {
          return;
        }
        ;
        out.printLine(sys.Str.plus("  ", part));
        return;
      });
    }
    ;
    return;
  }

  excludeEntity($def) {
    return (sys.ObjUtil.equals($def.name(), "pointGroup") || sys.ObjUtil.equals(this.#ns.supertypes($def).first().name(), "pointGroup"));
  }

  isAbstract(name) {
    return (sys.ObjUtil.equals(name, "airHandlingEquip") || sys.ObjUtil.equals(name, "airTerminalUnit") || sys.ObjUtil.equals(name, "conduit") || sys.ObjUtil.equals(name, "coil") || sys.ObjUtil.equals(name, "entity") || sys.ObjUtil.equals(name, "radiantEquip") || sys.ObjUtil.equals(name, "verticalTransport") || sys.ObjUtil.equals(name, "pointGroup") || sys.ObjUtil.equals(name, "hvacZonePoints") || sys.ObjUtil.equals(name, "lightingZonePoints") || sys.ObjUtil.equals(name, "airQualityZonePoints") || sys.ObjUtil.equals(name, "phenomenon") || sys.ObjUtil.equals(name, "quantity") || sys.ObjUtil.equals(name, "substance") || sys.ObjUtil.equals(name, "fluid") || sys.ObjUtil.equals(name, "liquid") || sys.ObjUtil.equals(name, "gas") || sys.ObjUtil.equals(name, "airQuality"));
  }

  writeEntitySlots(out,entity) {
    const this$ = this;
    let tags = sys.List.make(haystack.Def.type$);
    let maxNameSize = 2;
    if (sys.ObjUtil.equals(entity.name(), "equip")) {
      (maxNameSize = 12);
    }
    ;
    this.#ns.tags(entity).each((tag) => {
      if (this$.isInherited(entity, tag)) {
        return;
      }
      ;
      tags.add(tag);
      (maxNameSize = sys.Int.max(maxNameSize, sys.Str.size(tag.name())));
      return;
    });
    tags.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    tags.each((tag) => {
      this$.writeEntitySlot(out, tag.name(), maxNameSize, this$.toSlotType(entity, tag));
      return;
    });
    if (sys.ObjUtil.equals(entity.name(), "equip")) {
      this.writeEntitySlot(out, "parentEquips", maxNameSize, "Query<of:Point, via:\"equipRef+\">                  // Parent equips that contain this point");
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "equip")) {
      this.writeEntitySlot(out, "childEquips", maxNameSize, "Query<of:Point, inverse:\"ph::Equip.parentEquips\"> // Sub-equips contained by this equip");
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "equip")) {
      this.writeEntitySlot(out, "points", maxNameSize, "Query<of:Point, inverse:\"ph::Point.equips\">       // Points contained by this equip");
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "point")) {
      this.writeEntitySlot(out, "equips", maxNameSize, "Query<of:Equip, via:\"equipRef+\">  // Parent equips that contain this point");
    }
    ;
    return;
  }

  toSlotType(entity,tag) {
    let type = this.toTagType(tag);
    if (this.#ns.fitsChoice(tag)) {
      (type = this.toChoiceTypeName(tag));
    }
    ;
    if (this.isOptional(entity, tag)) {
      type = sys.Str.plus(type, "?");
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "airHandlingEquip")) {
      if ((sys.ObjUtil.equals(tag.name(), "heatingProcess") || sys.ObjUtil.equals(tag.name(), "coolingProcess"))) {
        type = sys.Str.plus(type, " <multiChoice>");
      }
      ;
    }
    ;
    return type;
  }

  writeEntitySlot(out,name,maxNameSize,sig) {
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", name), ": "), sys.Str.spaces(sys.Int.minus(maxNameSize, sys.Str.size(sys.Str.toStr(name))))), sig));
    return;
  }

  isOptional(entity,tag) {
    if (sys.ObjUtil.equals(tag.name(), "id")) {
      return false;
    }
    ;
    if (sys.ObjUtil.equals(entity.name(), "point")) {
      if (sys.ObjUtil.equals(tag.name(), "kind")) {
        return false;
      }
      ;
      return true;
    }
    ;
    if (sys.ObjUtil.equals(tag.name(), "siteRef")) {
      return false;
    }
    ;
    return true;
  }

  isInherited(entity,tag) {
    let on = sys.ObjUtil.as(tag.get("tagOn"), sys.Type.find("haystack::Symbol[]"));
    return !on.contains(entity.symbol());
  }

  writeEnums() {
    const this$ = this;
    let enums = sys.List.make(haystack.Def.type$);
    this.#ns.eachDef(($def) => {
      if ($def.missing("enum")) {
        return;
      }
      ;
      if ((sys.ObjUtil.equals($def.name(), "tz") || sys.ObjUtil.equals($def.name(), "unit"))) {
        return;
      }
      ;
      if (!$def.symbol().type().isTag()) {
        return;
      }
      ;
      enums.add($def);
      return;
    });
    enums.sort((a,b) => {
      return sys.ObjUtil.compare(this$.toEnumTypeName(a), this$.toEnumTypeName(b));
    });
    this.write(sys.Uri.fromStr("enums.xeto"), (out) => {
      enums.each(($def) => {
        this$.writeEnum(out, $def);
        return;
      });
      return;
    });
    return;
  }

  writeEnum(out,$def) {
    const this$ = this;
    let docAbove = false;
    let nameAndMetas = sys.List.make(sys.Str.type$);
    let docs = sys.List.make(sys.Str.type$);
    let maxNameAndMetaSize = 2;
    def.DefUtil.parseEnum($def.get("enum")).each((item) => {
      let name = sys.ObjUtil.coerce(item.trap("name", sys.List.make(sys.Obj.type$.toNullable(), [])), sys.Str.type$);
      let nameAndMeta = name;
      if (!haystack.Etc.isTagName(name)) {
        (nameAndMeta = sys.Str.plus(this$.normEnumName(name), sys.Str.plus(sys.Str.plus(" <key:", sys.Str.toCode(name)), ">")));
      }
      ;
      let doc = ((this$) => { let $_u21 = sys.ObjUtil.as(item.get("doc"), sys.Str.type$); if ($_u21 != null) return $_u21; return ""; })(this$);
      if (sys.Str.contains(doc, "\n")) {
        (docAbove = true);
      }
      ;
      nameAndMetas.add(nameAndMeta);
      docs.add(sys.ObjUtil.coerce(doc, sys.Str.type$));
      (maxNameAndMetaSize = sys.Int.max(maxNameAndMetaSize, sys.Str.size(nameAndMeta)));
      return;
    });
    this.writeDoc(out, $def);
    let name = this.toEnumTypeName($def);
    out.printLine(sys.Str.plus(sys.Str.plus("", name), ": Enum {"));
    nameAndMetas.each((nameAndMeta,i) => {
      let doc = docs.get(i);
      if ((!sys.Str.isEmpty(doc) && docAbove)) {
        sys.Str.splitLines(doc).each((line) => {
          out.printLine(sys.Str.trimEnd(sys.Str.plus("  // ", line)));
          return;
        });
      }
      ;
      out.print(sys.Str.plus("  ", nameAndMeta));
      if ((!sys.Str.isEmpty(doc) && !docAbove)) {
        out.print(sys.Str.spaces(sys.Int.minus(maxNameAndMetaSize, sys.Str.size(sys.Str.toStr(nameAndMeta))))).print("  // ").print(doc);
      }
      ;
      out.printLine();
      if ((docAbove && sys.ObjUtil.compareLT(sys.Int.plus(i, 1), nameAndMetas.size()))) {
        out.printLine();
      }
      ;
      return;
    });
    out.printLine("}");
    out.printLine();
    return;
  }

  writeChoices() {
    const this$ = this;
    let choices = this.#ns.subtypes(sys.ObjUtil.coerce(this.#ns.def("choice"), haystack.Def.type$));
    choices.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    this.write(sys.Uri.fromStr("choices.xeto"), (out) => {
      choices.each(($def) => {
        this$.writeChoice(out, $def);
        return;
      });
      return;
    });
    this.writeChoiceTaxonomy(sys.ObjUtil.coerce(this.#ns.def("phenomenon"), haystack.Def.type$));
    this.writeChoiceTaxonomy(sys.ObjUtil.coerce(this.#ns.def("quantity"), haystack.Def.type$));
    return;
  }

  writeChoice(out,$def) {
    const this$ = this;
    if (this.choiceSimplify($def) != null) {
      return;
    }
    ;
    let specName = this.toChoiceTypeName($def);
    let baseName = "Choice";
    let suffix = "";
    let $_u22 = specName;
    if (sys.ObjUtil.equals($_u22, "AhuZoneDelivery")) {
      (suffix = "Ahu");
    }
    else if (sys.ObjUtil.equals($_u22, "ChillerMechanism")) {
      (suffix = "Chiller");
    }
    else if (sys.ObjUtil.equals($_u22, "DuctSection")) {
      (suffix = "Duct");
    }
    else if (sys.ObjUtil.equals($_u22, "PipeSection")) {
      (suffix = "Pipe");
    }
    else if (sys.ObjUtil.equals($_u22, "VavAirCircuit")) {
      (suffix = "Vav");
    }
    else if (sys.ObjUtil.equals($_u22, "VavModulation")) {
      (suffix = "Vav");
    }
    ;
    let section = "//////////////////////////////////////////////////////////////////////////";
    out.printLine(section);
    out.printLine(sys.Str.plus("// ", specName));
    out.printLine(section);
    out.printLine();
    let of$ = $def.get("of");
    if (of$ != null) {
      (baseName = this.toChoiceTypeName(sys.ObjUtil.coerce(this.#ns.def(sys.ObjUtil.toStr(of$)), haystack.Def.type$)));
    }
    ;
    this.writeDoc(out, $def);
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("", specName), ": "), baseName));
    out.printLine();
    if (of$ != null) {
      return;
    }
    ;
    this.#ns.subtypes($def).each((sub) => {
      this$.writeChoiceItem(out, specName, suffix, sub);
      return;
    });
    return;
  }

  writeChoiceItem(out,base,suffix,x) {
    const this$ = this;
    let tag = ((this$) => { if (x.symbol().type().isConjunct()) return x.symbol().part(1); return x.name(); })(this);
    let name = sys.Str.plus(sys.Str.capitalize(tag), suffix);
    this.writeDoc(out, x);
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), ": "), base), " { "), tag), " }"));
    out.printLine();
    (suffix = name);
    this.#ns.subtypes(x).each((sub) => {
      this$.writeChoiceItem(out, name, suffix, sub);
      return;
    });
    return;
  }

  writeChoiceTaxonomy($def) {
    const this$ = this;
    this.write(sys.Str.toUri(sys.Str.plus(sys.Str.plus("", $def.name()), ".xeto")), (out) => {
      this$.writeChoiceTaxonomyLevel(out, $def, "Choice");
      return;
    });
    return;
  }

  writeChoiceTaxonomyLevel(out,$def,baseName) {
    const this$ = this;
    let specName = this.toChoiceTypeName($def);
    let tags = this.toChoiceTaxonomyTags($def);
    this.writeDoc(out, $def);
    out.print(sys.Str.plus(sys.Str.plus(sys.Str.plus("", specName), ": "), baseName));
    if (tags != null) {
      out.print(sys.Str.plus(sys.Str.plus(" { ", tags), " }"));
    }
    ;
    out.printLine();
    out.printLine();
    let subtypes = this.#ns.subtypes($def);
    subtypes.sort((a,b) => {
      return sys.ObjUtil.compare(a.name(), b.name());
    });
    subtypes.each((sub) => {
      this$.writeChoiceTaxonomyLevel(out, sub, specName);
      return;
    });
    return;
  }

  toChoiceTaxonomyTags($def) {
    let sym = $def.symbol();
    if (sym.type().isTag()) {
      let name = sym.name();
      if (this.isAbstract(name)) {
        return null;
      }
      ;
      return name;
    }
    ;
    let part1 = $def.symbol().part(0);
    let part2 = $def.symbol().part(1);
    let supertype = this.#ns.supertypes($def).first();
    if (this.#ns.fits(sys.ObjUtil.coerce(supertype, haystack.Def.type$), sys.ObjUtil.coerce(this.#ns.def(part1), haystack.Def.type$))) {
      return part2;
    }
    ;
    if (this.#ns.fits(sys.ObjUtil.coerce(supertype, haystack.Def.type$), sys.ObjUtil.coerce(this.#ns.def(part2), haystack.Def.type$))) {
      return part1;
    }
    ;
    return sys.Str.plus(sys.Str.plus(sys.Str.plus("", part1), ", "), part2);
  }

  choiceSimplify($def) {
    let of$ = $def.get("of");
    if (of$ != null) {
      return sys.Str.capitalize(sys.ObjUtil.toStr(of$));
    }
    ;
    return null;
  }

  writeFeatureDefs() {
    const this$ = this;
    this.write(sys.Uri.fromStr("filetypes.xeto"), (out) => {
      out.printLine("// File format type definition\nFiletype: Feature {\n  filetype         // Filetype marker\n  fileExt:   Str?  // Filename extension such as \"csv\"\n  mime:      Str?  // Mime type formatted as \"type/subtype\"\n  wikipedia: Uri?  // Wikipedia link\n}\n");
      this$.#ns.filetypes().each((x) => {
        this$.writeFeatureInstance(out, x);
        return;
      });
      return;
    });
    this.write(sys.Uri.fromStr("ops.xeto"), (out) => {
      out.printLine("// Operation for HTTP API.  See `docHaystack::Ops` chapter.\nOp: Feature {\n  // Op marker\n  op\n\n  // Marks a function or operation as having no side effects.  The function\n  // may or may not be *pure* in that calling it multiple times with the\n  // same arguments always evaluates to the same result.\n  noSideEffects: Marker?\n}\n");
      this$.#ns.feature("op").defs().sort().each((x) => {
        this$.writeFeatureInstance(out, x);
        return;
      });
      return;
    });
    return;
  }

  writeFeatureType(out,$def) {
    let type = sys.Str.capitalize($def.name());
    let tags = this.#ns.tags($def);
    this.writeDoc(out, $def);
    out.printLine(sys.Str.plus(sys.Str.plus("", type), ": Feature {"));
    this.writeEntitySlots(out, $def);
    out.printLine("}");
    out.printLine();
    return;
  }

  writeFeatureInstance(out,$def) {
    const this$ = this;
    let type = sys.Str.capitalize($def.symbol().part(0));
    this.writeDoc(out, $def);
    out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("@", $def.symbol()), " : "), type), " {"));
    let names = haystack.Etc.dictNames($def);
    names.removeAll(sys.List.make(sys.Str.type$, ["def", "lib", "is", "doc"]));
    names.sort();
    names.each((n) => {
      let v = $def.get(n);
      if (v === haystack.Marker.val()) {
        out.printLine(sys.Str.plus("  ", n));
      }
      else {
        out.printLine(sys.Str.plus(sys.Str.plus(sys.Str.plus("  ", n), ": "), sys.Str.toCode(sys.ObjUtil.toStr(v))));
      }
      ;
      return;
    });
    out.printLine("}");
    out.printLine();
    return;
  }

  static make() {
    const $self = new GenPH();
    GenPH.make$($self);
    return $self;
  }

  static make$($self) {
    AbstractGenCmd.make$($self);
    ;
    return;
  }

  multiRefs$Once() {
    return sys.ObjUtil.coerce(sys.ObjUtil.toImmutable(sys.List.make(sys.Str.type$, ["systemRef"])), sys.Type.find("sys::Str[]"));
  }

}

class Main extends sys.Obj {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return Main.type$; }

  static main(args) {
    if ((args.isEmpty() || sys.ObjUtil.equals(args.first(), "-?") || sys.ObjUtil.equals(args.first(), "-help") || sys.ObjUtil.equals(args.first(), "--help"))) {
      (args = sys.List.make(sys.Str.type$, ["help"]));
    }
    ;
    let cmdName = args.first();
    let cmd = XetoCmd.find(sys.ObjUtil.coerce(cmdName, sys.Str.type$));
    if (cmd == null) {
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus("ERROR: unknown xeto command '", cmdName), "'"));
      return 1;
    }
    ;
    return cmd.main(args.dup().getRange(sys.Range.make(1, -1)));
  }

  static make() {
    const $self = new Main();
    Main.make$($self);
    return $self;
  }

  static make$($self) {
    return;
  }

}

class HelpCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
    this.#commandName = sys.List.make(sys.Str.type$);
    return;
  }

  typeof() { return HelpCmd.type$; }

  #commandName = null;

  commandName(it) {
    if (it === undefined) {
      return this.#commandName;
    }
    else {
      this.#commandName = it;
      return;
    }
  }

  name() {
    return "help";
  }

  aliases() {
    return sys.List.make(sys.Str.type$, ["-h", "-?"]);
  }

  summary() {
    return "Print listing of available commands";
  }

  run() {
    const this$ = this;
    if (sys.ObjUtil.compareGT(this.#commandName.size(), 0)) {
      let cmdName = this.#commandName.get(0);
      let cmd = XetoCmd.find(cmdName);
      if (cmd == null) {
        return this.err(sys.Str.plus(sys.Str.plus("Unknown help command '", cmdName), "'"));
      }
      ;
      this.printLine();
      let ret = cmd.usage();
      this.printLine();
      return ret;
    }
    ;
    let cmds = XetoCmd.list();
    let names = sys.ObjUtil.coerce(cmds.map((cmd) => {
      return cmd.names().join(", ");
    }, sys.Str.type$), sys.Type.find("sys::Str[]"));
    let maxName = 4;
    names.each((n) => {
      (maxName = sys.Int.max(maxName, sys.Str.size(n)));
      return;
    });
    this.printLine();
    this.printLine("Xeto CLI Tools:");
    this.printLine();
    XetoCmd.list().each((cmd,i) => {
      this$.printLine(sys.Str.plus(sys.Str.plus(sys.Str.padr(names.get(i), maxName), "  "), cmd.summary()));
      return;
    });
    this.printLine();
    return 0;
  }

  static make() {
    const $self = new HelpCmd();
    HelpCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    ;
    return;
  }

}

class EnvCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return EnvCmd.type$; }

  name() {
    return "env";
  }

  summary() {
    return "Print environment and lib path info";
  }

  run() {
    let out = sys.Env.cur().out();
    out.printLine();
    util.AbstractMain.printProps(xeto.XetoEnv.cur().debugProps(), sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    out.printLine();
    return 0;
  }

  static make() {
    const $self = new EnvCmd();
    EnvCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class VersionCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return VersionCmd.type$; }

  name() {
    return "version";
  }

  aliases() {
    return sys.List.make(sys.Str.type$, ["-v"]);
  }

  summary() {
    return "Print version info";
  }

  run() {
    const this$ = this;
    let props = sys.ObjUtil.coerce(sys.ObjUtil.with(sys.Map.__fromLiteral([], [], sys.Type.find("sys::Str"), sys.Type.find("sys::Obj")), (it) => {
      it.ordered(true);
      return;
    }), sys.Type.find("[sys::Str:sys::Obj]"));
    util.AbstractMain.runtimeProps(props);
    let out = sys.Env.cur().out();
    out.printLine();
    out.printLine("Xeto CLI Tools");
    out.printLine(sys.Str.plus(sys.Str.plus("Copyright (c) 2022-", sys.ObjUtil.coerce(sys.Date.today().year(), sys.Obj.type$.toNullable())), ", SkyFoundry LLC"));
    out.printLine("Licensed under the Academic Free License version 3.0");
    out.printLine();
    util.AbstractMain.printProps(props, sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    out.printLine();
    util.AbstractMain.printProps(xeto.XetoEnv.cur().debugProps(), sys.Map.__fromLiteral(["out"], [out], sys.Type.find("sys::Str"), sys.Type.find("sys::OutStream")));
    out.printLine();
    return 0;
  }

  static make() {
    const $self = new VersionCmd();
    VersionCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

class RepoCmd extends XetoCmd {
  constructor() {
    super();
    const this$ = this;
  }

  typeof() { return RepoCmd.type$; }

  #versions = false;

  versions(it) {
    if (it === undefined) {
      return this.#versions;
    }
    else {
      this.#versions = it;
      return;
    }
  }

  #full = false;

  full(it) {
    if (it === undefined) {
      return this.#full;
    }
    else {
      this.#full = it;
      return;
    }
  }

  #libs = null;

  libs(it) {
    if (it === undefined) {
      return this.#libs;
    }
    else {
      this.#libs = it;
      return;
    }
  }

  name() {
    return "repo";
  }

  summary() {
    return "List locally installed libs";
  }

  run() {
    const this$ = this;
    let repo = xeto.LibRepo.cur();
    let libNames = ((this$) => { let $_u24 = this$.#libs; if ($_u24 != null) return $_u24; return repo.libs(); })(this);
    sys.ObjUtil.echo();
    libNames.each((libName) => {
      this$.listLib(repo, libName);
      return;
    });
    sys.ObjUtil.echo();
    return 0;
  }

  listLib(repo,name) {
    const this$ = this;
    if (!this.#versions) {
      let latest = repo.latest(name);
      sys.ObjUtil.echo(sys.Str.plus(sys.Str.plus(sys.Str.plus(sys.Str.plus("", name), " ["), latest.version()), "]"));
      if (this.#full) {
        this.listFull(sys.ObjUtil.coerce(latest, xeto.LibVersion.type$), sys.Str.spaces(2));
      }
      ;
      return;
    }
    ;
    let versions = repo.versions(name);
    sys.ObjUtil.echo();
    sys.ObjUtil.echo(sys.Str.plus("", name));
    versions.each((v) => {
      sys.ObjUtil.echo(sys.Str.plus("  ", v.version()));
      if (this$.#full) {
        this$.listFull(v, sys.Str.spaces(4));
      }
      ;
      return;
    });
    return;
  }

  listFull(v,indent) {
    const this$ = this;
    sys.ObjUtil.echo(sys.Str.plus(indent, sys.Str.plus("File:   ", v.file().osPath())));
    sys.ObjUtil.echo(sys.Str.plus(indent, sys.Str.plus("Doc:    ", v.doc())));
    v.depends().each((d) => {
      sys.ObjUtil.echo(sys.Str.plus(indent, sys.Str.plus("Depend: ", d)));
      return;
    });
    return;
  }

  static make() {
    const $self = new RepoCmd();
    RepoCmd.make$($self);
    return $self;
  }

  static make$($self) {
    XetoCmd.make$($self);
    return;
  }

}

const p = sys.Pod.add$('xetoTools');
const xp = sys.Param.noParams$();
let m;
XetoCmd.type$ = p.at$('XetoCmd','util::AbstractMain',[],{},8193,XetoCmd);
SrcLibCmd.type$ = p.at$('SrcLibCmd','xetoTools::XetoCmd',[],{},129,SrcLibCmd);
BuildCmd.type$ = p.at$('BuildCmd','xetoTools::SrcLibCmd',[],{},128,BuildCmd);
CleanCmd.type$ = p.at$('CleanCmd','xetoTools::SrcLibCmd',[],{},128,CleanCmd);
DocCmd.type$ = p.at$('DocCmd','xetoTools::SrcLibCmd',[],{},128,DocCmd);
InitCmd.type$ = p.at$('InitCmd','xetoTools::XetoCmd',[],{},128,InitCmd);
ExportCmd.type$ = p.at$('ExportCmd','xetoTools::XetoCmd',[],{},129,ExportCmd);
ExportTarget.type$ = p.at$('ExportTarget','sys::Obj',[],{},130,ExportTarget);
ExportHaystack.type$ = p.at$('ExportHaystack','xetoTools::ExportCmd',[],{},129,ExportHaystack);
ExportTrio.type$ = p.at$('ExportTrio','xetoTools::ExportHaystack',[],{},128,ExportTrio);
ExportZinc.type$ = p.at$('ExportZinc','xetoTools::ExportHaystack',[],{},128,ExportZinc);
ExportHayson.type$ = p.at$('ExportHayson','xetoTools::ExportHaystack',[],{},128,ExportHayson);
ExportJson.type$ = p.at$('ExportJson','xetoTools::ExportCmd',[],{},128,ExportJson);
ExportRdf.type$ = p.at$('ExportRdf','xetoTools::ExportCmd',[],{},128,ExportRdf);
FitsCmd.type$ = p.at$('FitsCmd','xetoTools::XetoCmd',[],{},128,FitsCmd);
FitsCmdContext.type$ = p.at$('FitsCmdContext','sys::Obj',['xeto::XetoContext'],{},128,FitsCmdContext);
GenAxon.type$ = p.at$('GenAxon','xetoTools::XetoCmd',[],{},128,GenAxon);
StubFunc.type$ = p.at$('StubFunc','sys::Obj',[],{},128,StubFunc);
StubParam.type$ = p.at$('StubParam','sys::Obj',[],{},130,StubParam);
AbstractGenCmd.type$ = p.at$('AbstractGenCmd','xetoTools::XetoCmd',[],{},129,AbstractGenCmd);
GenTz.type$ = p.at$('GenTz','xetoTools::AbstractGenCmd',[],{},128,GenTz);
GenUnits.type$ = p.at$('GenUnits','xetoTools::AbstractGenCmd',[],{},128,GenUnits);
GenWriter.type$ = p.at$('GenWriter','sys::Obj',[],{},8192,GenWriter);
GenFantom.type$ = p.at$('GenFantom','xetoTools::AbstractGenCmd',[],{},128,GenFantom);
FantomGenWriter.type$ = p.at$('FantomGenWriter','xetoTools::GenWriter',[],{},128,FantomGenWriter);
GenPH.type$ = p.at$('GenPH','xetoTools::AbstractGenCmd',[],{},128,GenPH);
Main.type$ = p.at$('Main','sys::Obj',[],{},8192,Main);
HelpCmd.type$ = p.at$('HelpCmd','xetoTools::XetoCmd',[],{},128,HelpCmd);
EnvCmd.type$ = p.at$('EnvCmd','xetoTools::XetoCmd',[],{},128,EnvCmd);
VersionCmd.type$ = p.at$('VersionCmd','xetoTools::XetoCmd',[],{},128,VersionCmd);
RepoCmd.type$ = p.at$('RepoCmd','xetoTools::XetoCmd',[],{},128,RepoCmd);
XetoCmd.type$.am$('find',40962,'xetoTools::XetoCmd?',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('list',40962,'xetoTools::XetoCmd[]',xp,{}).am$('appName',9216,'sys::Str',xp,{}).am$('log',271360,'sys::Log',xp,{}).am$('name',270337,'sys::Str',xp,{}).am$('aliases',270336,'sys::Str[]',xp,{}).am$('names',8192,'sys::Str[]',xp,{}).am$('run',271361,'sys::Int',xp,{}).am$('summary',270337,'sys::Str',xp,{}).am$('readInputFile',8192,'haystack::Dict[]',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File?',false)]),{}).am$('writeOutputFile',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('grid','haystack::Grid',false)]),{}).am$('printLine',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('line','sys::Str',true)]),{}).am$('err',8192,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('withOut',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('arg','sys::File?',false),new sys.Param('f','|sys::OutStream->sys::Void|',false)]),{}).am$('promptConfirm',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
SrcLibCmd.type$.af$('all',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"All source libs in working dir\";}"}).af$('allIn',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"All source libs under given directory\";}"}).af$('libs',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"List of lib names for any source lib in path\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('process',270337,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
BuildCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('process',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
CleanCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('process',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('clean',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false)]),{}).am$('make',139268,'sys::Void',xp,{});
DocCmd.type$.af$('outDir',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output directory\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('process',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('vers','xeto::LibVersion[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
InitCmd.type$.af$('dir',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output directory for new lib source dir\";}"}).af$('noconfirm',73728,'sys::Bool',{'util::Opt':"util::Opt{aliases=[\"y\"];help=\"Skip confirmation\";}"}).af$('libName',73728,'sys::Str?',{'util::Arg':"util::Arg{help=\"Dotted name of the new lib\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('toRootDir',2048,'sys::File',xp,{}).am$('genMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('genSpecs',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ExportCmd.type$.af$('all',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"All libs installed in repo\";}"}).af$('verbose',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Dump debug info as processing\";}"}).af$('outDir',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output directory (generates one file per target)\";}"}).af$('outFile',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output file (combine all targets in one file, default to stdout)\";}"}).af$('targets',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"Libs, specs, and instances to export\";}"}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('run',271360,'sys::Int',xp,{}).am$('checkArgs',2048,'sys::Bool',xp,{}).am$('findTargets',2048,'xetoTools::ExportTarget[]',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false)]),{}).am$('findAllTargets',2048,'xetoTools::ExportTarget[]',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false)]),{}).am$('findTarget',2048,'xetoTools::ExportTarget',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('name','sys::Str',false)]),{}).am$('createNamespace',2048,'xeto::LibNamespace',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('targets','xetoTools::ExportTarget[]',false)]),{}).am$('exportTargets',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('targets','xetoTools::ExportTarget[]',false)]),{}).am$('exportToDir',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('targets','xetoTools::ExportTarget[]',false)]),{}).am$('exportToFile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('targets','xetoTools::ExportTarget[]',false)]),{}).am$('exportTarget',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('ex','xetoEnv::Exporter',false),new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('initExporter',270337,'xetoEnv::Exporter',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toFileName',270337,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ExportTarget.type$.af$('lib',73730,'xeto::LibVersion',{}).af$('specName',73730,'sys::Str?',{}).af$('depend',73730,'xeto::LibDepend',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('lib','xeto::LibVersion',false),new sys.Param('specName','sys::Str?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
ExportHaystack.type$.af$('effective',73728,'sys::Bool',{'util::Opt':"util::Opt{aliases=[\"e\"];help=\"Generate inherited effective meta/slots (default is own)\";}"}).af$('defns$Store',722944,'sys::Obj?',{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('initExporter',271360,'xetoEnv::Exporter',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toFileName',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('defns',532480,'haystack::Namespace',xp,{}).am$('filetype',270337,'haystack::Filetype',xp,{}).am$('make',139268,'sys::Void',xp,{}).am$('defns$Once',133120,'haystack::Namespace',xp,{});
ExportTrio.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('filetype',271360,'haystack::Filetype',xp,{}).am$('make',139268,'sys::Void',xp,{});
ExportZinc.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('filetype',271360,'haystack::Filetype',xp,{}).am$('make',139268,'sys::Void',xp,{});
ExportHayson.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('filetype',271360,'haystack::Filetype',xp,{}).am$('make',139268,'sys::Void',xp,{});
ExportJson.type$.af$('effective',73728,'sys::Bool',{'util::Opt':"util::Opt{aliases=[\"e\"];help=\"Generate inherited effective meta/slots (default is own)\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('initExporter',271360,'xetoEnv::Exporter',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toFileName',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('make',139268,'sys::Void',xp,{});
ExportRdf.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('initExporter',271360,'xetoEnv::Exporter',sys.List.make(sys.Param.type$,[new sys.Param('ns','xeto::LibNamespace',false),new sys.Param('out','sys::OutStream',false)]),{}).am$('toFileName',271360,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('t','xetoTools::ExportTarget',false)]),{}).am$('make',139268,'sys::Void',xp,{});
FitsCmd.type$.af$('graph',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Check graph of query references such as required points\";}"}).af$('ignoreRefs',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Ignore if refs resolve to valid target in input data set\";}"}).af$('outFile',73728,'sys::File?',{'util::Opt':"util::Opt{help=\"Output file or if stdout if omitted (must have zinc, trio, json extension)\";}"}).af$('input',73728,'sys::File?',{'util::Arg':"util::Arg{help=\"Input file (must have zinc, trio, json extension)\";}"}).af$('recs',65664,'haystack::Dict[]?',{}).af$('recsById',65664,'[haystack::Ref:haystack::Dict]?',{}).af$('ns',65664,'xeto::LibNamespace?',{}).af$('hits',65664,'xeto::XetoLogRec[]?',{}).af$('numOk',67584,'sys::Int',{}).af$('numErr',67584,'sys::Int',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('usage',271360,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',true)]),{}).am$('run',271360,'sys::Int',xp,{}).am$('readInput',2048,'sys::Void',xp,{}).am$('loadNamespace',2048,'sys::Void',xp,{}).am$('runFits',2048,'sys::Void',xp,{}).am$('writeOutput',2048,'sys::Void',xp,{}).am$('writeConsole',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('con','util::Console',false)]),{}).am$('writeFile',2048,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
FitsCmdContext.type$.af$('cmd',73728,'xetoTools::FitsCmd',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('cmd','xetoTools::FitsCmd',false)]),{}).am$('xetoReadById',271360,'xeto::Dict?',sys.List.make(sys.Param.type$,[new sys.Param('id','sys::Obj',false)]),{}).am$('xetoReadAllEachWhile',271360,'sys::Obj?',sys.List.make(sys.Param.type$,[new sys.Param('filter','sys::Str',false),new sys.Param('f','|xeto::Dict->sys::Obj?|',false)]),{}).am$('xetoIsSpec',271360,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('spec','sys::Str',false),new sys.Param('rec','xeto::Dict',false)]),{});
GenAxon.type$.af$('podName',73728,'sys::Str?',{'util::Arg':"util::Arg{help=\"Pod name to compile\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('toFantomType',8192,'sys::Type?',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false)]),{}).am$('reflectType',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','xetoTools::StubFunc[]',false),new sys.Param('type','sys::Type',false)]),{}).am$('reflectMethod',8192,'xetoTools::StubFunc',sys.List.make(sys.Param.type$,[new sys.Param('method','sys::Method',false),new sys.Param('facet','axon::Axon',false)]),{}).am$('reflectParam',2048,'xetoTools::StubParam',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('type','sys::Type',false)]),{}).am$('writeAll',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('funcs','xetoTools::StubFunc[]',false)]),{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('func','xetoTools::StubFunc',false)]),{}).am$('writeParam',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('p','xetoTools::StubParam',false),new sys.Param('first','sys::Bool',false)]),{}).am$('reflectTrioFiles',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','xetoTools::StubFunc[]',false),new sys.Param('pod','sys::Pod',false)]),{}).am$('reflectTrioFile',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('acc','xetoTools::StubFunc[]',false),new sys.Param('f','sys::File',false)]),{}).am$('reflectTrioFunc',2048,'xetoTools::StubFunc?',sys.List.make(sys.Param.type$,[new sys.Param('loc','axon::Loc',false),new sys.Param('rec','haystack::Dict',false)]),{}).am$('make',139268,'sys::Void',xp,{});
StubFunc.type$.af$('name',73730,'sys::Str',{}).af$('doc',73730,'sys::Str',{}).af$('meta',73730,'haystack::Dict',{}).af$('params',73730,'xetoTools::StubParam[]',{}).af$('returns',73730,'xetoTools::StubParam',{}).af$('axon',73730,'sys::Str?',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('doc','sys::Str',false),new sys.Param('meta','haystack::Dict',false),new sys.Param('params','xetoTools::StubParam[]',false),new sys.Param('returns','xetoTools::StubParam',false),new sys.Param('axon','sys::Str?',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
StubParam.type$.af$('name',73730,'sys::Str',{}).af$('type',73730,'sys::Str',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false),new sys.Param('type','sys::Str',false)]),{}).am$('toStr',271360,'sys::Str',xp,{});
AbstractGenCmd.type$.af$('ts',73730,'sys::Str',{}).am$('outDir',270337,'sys::File',xp,{}).am$('write',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('uri','sys::Uri',false),new sys.Param('cb','|sys::OutStream->sys::Void|',false)]),{}).am$('isFileChanged',40962,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false),new sys.Param('newContents','sys::Str',false)]),{}).am$('writeDoc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('info',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('msg','sys::Str',false)]),{}).am$('normEnumName',8192,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});
GenTz.type$.af$('outDir',336896,'sys::File',{'util::Opt':"util::Opt{help=\"Directory to output\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
GenUnits.type$.af$('outDir',336896,'sys::File',{'util::Opt':"util::Opt{help=\"Directory to output\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
GenWriter.type$.af$('file',73730,'sys::File',{}).af$('buf',73728,'sys::StrBuf',{}).am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('w',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj',false)]),{}).am$('str',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Obj?',false)]),{}).am$('nl',8192,'sys::This',xp,{}).am$('close',8192,'sys::Void',xp,{});
GenFantom.type$.af$('workDir',73728,'sys::File',{'util::Opt':"util::Opt{help=\"Base directory to contain 'src/xeto'\";}"}).af$('podNames',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"Pod names to compile\";}"}).af$('outDir',336896,'sys::File',{}).af$('numFiles',73728,'sys::Int',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('genPod',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false)]),{}).am$('genLibMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('pod','sys::Pod',false)]),{}).am$('genType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Type',false)]),{}).am$('skipType',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('type','sys::Type',false)]),{}).am$('toTypeMeta',8192,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Type',false)]),{}).am$('genSlot',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','xetoTools::FantomGenWriter',false),new sys.Param('x','sys::Slot',false)]),{}).am$('skipSlot',8192,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('slot','sys::Slot',false)]),{}).am$('genField',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','xetoTools::FantomGenWriter',false),new sys.Param('x','sys::Field',false)]),{}).am$('genMethod',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','xetoTools::FantomGenWriter',false),new sys.Param('x','sys::Method',false)]),{}).am$('toFieldMeta',8192,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Field',false)]),{}).am$('toMethodMeta',8192,'[sys::Str:sys::Obj]',sys.List.make(sys.Param.type$,[new sys.Param('x','sys::Method',false)]),{}).am$('open',8192,'xetoTools::FantomGenWriter',sys.List.make(sys.Param.type$,[new sys.Param('filename','sys::Uri',false)]),{}).am$('genDoc',8192,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','xetoTools::FantomGenWriter',false),new sys.Param('doc','sys::Str?',false),new sys.Param('indent','sys::Str',false)]),{}).am$('genSys',8192,'sys::Void',xp,{}).am$('make',139268,'sys::Void',xp,{});
FantomGenWriter.type$.am$('make',8196,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('file','sys::File',false)]),{}).am$('sig',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('t','sys::Type',false)]),{}).am$('meta',8192,'sys::This',sys.List.make(sys.Param.type$,[new sys.Param('acc','[sys::Str:sys::Obj]',false)]),{});
GenPH.type$.af$('outDir',336896,'sys::File',{'util::Opt':"util::Opt{help=\"Directory to output\";}"}).af$('defSymbol',67586,'haystack::Symbol',{}).af$('ns',67584,'haystack::Namespace?',{}).af$('ph',67584,'haystack::Lib?',{}).af$('multiRefs$Store',722944,'sys::Obj?',{}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('checkInputs',2048,'sys::Void',xp,{}).am$('compileNamespace',2048,'sys::Void',xp,{}).am$('writeLib',2048,'sys::Void',xp,{}).am$('writeTags',2048,'sys::Void',xp,{}).am$('excludeTag',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false),new sys.Param('kind','haystack::Kind',false)]),{}).am$('toTagType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('tag','haystack::Def',false)]),{}).am$('multiRefs',526336,'sys::Str[]',xp,{}).am$('toEnumTypeName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('tag','haystack::Def',false)]),{}).am$('toChoiceTypeName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('toTagMeta',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false),new sys.Param('kind','haystack::Kind',false)]),{}).am$('writeEntities',2048,'sys::Void',xp,{}).am$('toEntityName',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('toEntityType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('writeEntityMeta',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('entity','haystack::Def',false)]),{}).am$('writeEntityUsage',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('entity','haystack::Def',false)]),{}).am$('excludeEntity',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('isAbstract',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('name','sys::Str',false)]),{}).am$('writeEntitySlots',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('entity','haystack::Def',false)]),{}).am$('toSlotType',2048,'sys::Str',sys.List.make(sys.Param.type$,[new sys.Param('entity','haystack::Def',false),new sys.Param('tag','haystack::Def',false)]),{}).am$('writeEntitySlot',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('name','sys::Str',false),new sys.Param('maxNameSize','sys::Int',false),new sys.Param('sig','sys::Str',false)]),{}).am$('isOptional',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('entity','haystack::Def',false),new sys.Param('tag','haystack::Def',false)]),{}).am$('isInherited',2048,'sys::Bool',sys.List.make(sys.Param.type$,[new sys.Param('entity','haystack::Def',false),new sys.Param('tag','haystack::Def',false)]),{}).am$('writeEnums',2048,'sys::Void',xp,{}).am$('writeEnum',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('writeChoices',2048,'sys::Void',xp,{}).am$('writeChoice',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('writeChoiceItem',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('base','sys::Str',false),new sys.Param('suffix','sys::Str',false),new sys.Param('x','haystack::Def',false)]),{}).am$('writeChoiceTaxonomy',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('writeChoiceTaxonomyLevel',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false),new sys.Param('baseName','sys::Str',false)]),{}).am$('toChoiceTaxonomyTags',2048,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('choiceSimplify',2048,'sys::Str?',sys.List.make(sys.Param.type$,[new sys.Param('def','haystack::Def',false)]),{}).am$('writeFeatureDefs',2048,'sys::Void',xp,{}).am$('writeFeatureType',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('writeFeatureInstance',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('out','sys::OutStream',false),new sys.Param('def','haystack::Def',false)]),{}).am$('make',139268,'sys::Void',xp,{}).am$('multiRefs$Once',133120,'sys::Str[]',xp,{});
Main.type$.am$('main',40962,'sys::Int',sys.List.make(sys.Param.type$,[new sys.Param('args','sys::Str[]',false)]),{}).am$('make',139268,'sys::Void',xp,{});
HelpCmd.type$.af$('commandName',73728,'sys::Str[]',{'util::Arg':""}).am$('name',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
EnvCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
VersionCmd.type$.am$('name',271360,'sys::Str',xp,{}).am$('aliases',271360,'sys::Str[]',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('make',139268,'sys::Void',xp,{});
RepoCmd.type$.af$('versions',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"List all the installed versions\";aliases=[\"v\"];}"}).af$('full',73728,'sys::Bool',{'util::Opt':"util::Opt{help=\"Full listing including file and dependencies\";aliases=[\"f\"];}"}).af$('libs',73728,'sys::Str[]?',{'util::Arg':"util::Arg{help=\"Specific lib name or names to dump\";}"}).am$('name',271360,'sys::Str',xp,{}).am$('summary',271360,'sys::Str',xp,{}).am$('run',271360,'sys::Int',xp,{}).am$('listLib',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('repo','xeto::LibRepo',false),new sys.Param('name','sys::Str',false)]),{}).am$('listFull',2048,'sys::Void',sys.List.make(sys.Param.type$,[new sys.Param('v','xeto::LibVersion',false),new sys.Param('indent','sys::Str',false)]),{}).am$('make',139268,'sys::Void',xp,{});

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "xetoTools");
m.set("pod.version", "3.1.11");
m.set("pod.depends", "sys 1.0;concurrent 1.0;util 1.0;web 1.0;xeto 3.1.11;xetoEnv 3.1.11;xetoDoc 3.1.11;haystack 3.1.11;axon 3.1.11;def 3.1.11;defc 3.1.11");
m.set("pod.summary", "Xeto CLI tools");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "JSBACH");
m.set("build.user", "mgiannini");
m.set("build.ts", "2025-02-14T14:25:16-05:00 New_York");
m.set("build.tsKey", "250214142516");
m.set("build.compiler", "1.0.77");
m.set("build.platform", "win32-x86_64");
m.set("pod.docSrc", "false");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "SkyFoundry");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Haxall");
m.set("proj.uri", "https://haxall.io/");
m.set("pod.docApi", "true");
m.set("org.uri", "https://skyfoundry.com/");
m.set("pod.native.java", "false");
m.set("vcs.uri", "https://github.com/haxall/haxall");
m.set("pod.native.jni", "false");
m.set("vcs.name", "Git");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
  XetoCmd,
  GenWriter,
  Main,
};
