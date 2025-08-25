// cjs require begin








import * as fan from './fan.js'

import * as sys from './sys.js'
// cjs require end
const js = (typeof window !== 'undefined') ? window : global;
const p = sys.Pod.add$('sedona');
const xp = sys.Param.noParams$();
let m;

m=sys.Map.make(sys.Str.type$,sys.Str.type$);
m.set("pod.name", "sedona");
m.set("pod.version", "1.2.28.2");
m.set("pod.depends", "");
m.set("pod.summary", "Sedona Sox Client");
m.set("pod.isScript", "false");
m.set("fcode.version", "1.0.51");
m.set("build.host", "JSBACH");
m.set("build.user", "mgiannini");
m.set("build.ts", "2025-02-14T14:25:16-05:00 New_York");
m.set("build.tsKey", "250214142516");
m.set("build.compiler", "1.0.77");
m.set("build.platform", "win32-x86_64");
m.set("license.name", "Academic Free License 3.0");
m.set("org.name", "Sedona");
m.set("pod.docSrc", "false");
m.set("pod.native.dotnet", "false");
m.set("proj.name", "Sedona");
m.set("pod.docApi", "false");
m.set("org.uri", "http://sedonadev.org/");
m.set("pod.native.java", "false");
m.set("pod.native.jni", "false");
m.set("pod.native.js", "false");
p.__meta(m);



// cjs exports begin
export {
};
