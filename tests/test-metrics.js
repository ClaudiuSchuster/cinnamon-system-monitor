/* global imports */

const ByteArray = imports.byteArray;
const GLib = imports.gi.GLib;

const [ok, contents] = GLib.file_get_contents("metrics.js");
if (!ok) throw new Error("Cannot read metrics.js");

const localModule = { exports: {} };
new Function("module", "exports", ByteArray.toString(contents))(
    localModule,
    localModule.exports
);
const Metrics = localModule.exports;

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
}

const firstCpu = Metrics.parseCpuStat("cpu  100 5 30 400 10 0 5 0\n", null);
const secondCpu = Metrics.parseCpuStat("cpu  140 5 50 460 10 0 5 0\n", firstCpu.sample);
assertEqual(Math.round(secondCpu.percentage), 50, "CPU percentage");

const memory = Metrics.parseMemInfo([
    "MemTotal:       1000 kB",
    "MemAvailable:    250 kB",
    "SwapTotal:       500 kB",
    "SwapFree:        400 kB"
].join("\n"));
assertEqual(memory.memoryPercentage, 75, "Memory percentage");
assertEqual(memory.swapPercentage, 20, "Swap percentage");

const gpu = Metrics.parseRadeontop("gpu 42.50%, ee 0.00%, vram 25.00% 2048.00mb");
assertEqual(gpu.gpuPercentage, 42.5, "GPU percentage");
assertEqual(gpu.vramPercentage, 25, "VRAM percentage");
assertEqual(gpu.vramUnit, "MB", "VRAM unit");

assertEqual(Metrics.formatPercent(99.6), "100%", "Percentage formatting");

const [liveMemOk, liveMemContents] = GLib.file_get_contents("/proc/meminfo");
if (!liveMemOk || !Metrics.parseMemInfo(ByteArray.toString(liveMemContents))) {
    throw new Error("Could not parse live /proc/meminfo data");
}

const [liveCpuOk, liveCpuContents] = GLib.file_get_contents("/proc/stat");
if (!liveCpuOk || !Metrics.parseCpuStat(ByteArray.toString(liveCpuContents), null)) {
    throw new Error("Could not parse live /proc/stat data");
}

print("Metric parser tests passed.");
