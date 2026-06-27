(function () {
  "use strict";

  const projectName = document.getElementById("projectName");
  const viewPath = document.getElementById("viewPath");
  const panoramaFile = document.getElementById("panoramaFile");
  const fileName = document.getElementById("fileName");
  const shareLink = document.getElementById("shareLink");
  const copyLink = document.getElementById("copyLink");
  const addHotspot = document.getElementById("addHotspot");
  const hotspotRows = document.getElementById("hotspotRows");
  const previewImage = document.getElementById("previewImage");
  const previewBox = document.querySelector(".preview-box");
  const downloadZip = document.getElementById("downloadZip");
  const statusText = document.getElementById("statusText");

  const baseUrl = "https://www.ashva.ae";
  let panoramaObjectUrl = "";

  function slugifyPath(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\\/g, "/")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9/._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/\/+/g, "/")
      .replace(/(^[-/]+|[-/]+$)/g, "");
  }

  function imageExtension(file) {
    const fromName = (file.name.split(".").pop() || "").toLowerCase();
    if (["jpg", "jpeg", "png", "webp", "svg"].includes(fromName)) {
      return fromName === "jpeg" ? "jpg" : fromName;
    }
    if (file.type.includes("png")) return "png";
    if (file.type.includes("webp")) return "webp";
    if (file.type.includes("svg")) return "svg";
    return "jpg";
  }

  function routePath() {
    const project = slugifyPath(projectName.value);
    const path = slugifyPath(viewPath.value);
    if (!project || !path) {
      return "";
    }
    return `3dviewdesigns/${project}/${path}`;
  }

  function updateLink() {
    const path = routePath();
    shareLink.value = path ? `${baseUrl}/${path}/` : "";
  }

  function setStatus(message) {
    statusText.textContent = message;
  }

  function addHotspotRow(data) {
    const row = document.createElement("div");
    row.className = "hotspot-row";
    row.innerHTML = [
      '<label>Label<input class="hotspot-label" type="text" placeholder="Next room"></label>',
      '<label>URL<input class="hotspot-url" type="url" placeholder="https://www.ashva.ae/..."></label>',
      '<label>Yaw<input class="hotspot-yaw" type="number" value="0"></label>',
      '<label>Pitch<input class="hotspot-pitch" type="number" value="0"></label>',
      '<button type="button" title="Remove hotspot" aria-label="Remove hotspot">x</button>'
    ].join("");

    row.querySelector(".hotspot-label").value = data?.label || "";
    row.querySelector(".hotspot-url").value = data?.url || "";
    row.querySelector(".hotspot-yaw").value = data?.yaw ?? 0;
    row.querySelector(".hotspot-pitch").value = data?.pitch ?? 0;
    row.querySelector("button").addEventListener("click", function () {
      row.remove();
    });
    hotspotRows.appendChild(row);
  }

  function collectHotspots() {
    return Array.from(document.querySelectorAll(".hotspot-row"))
      .map(function (row) {
        return {
          label: row.querySelector(".hotspot-label").value.trim(),
          url: row.querySelector(".hotspot-url").value.trim(),
          yaw: Number(row.querySelector(".hotspot-yaw").value) || 0,
          pitch: Number(row.querySelector(".hotspot-pitch").value) || 0
        };
      })
      .filter(function (hotspot) {
        return hotspot.label && hotspot.url;
      });
  }

  function viewerIndex(title) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <main class="app-shell">
      <section class="viewer-panel" aria-label="360 panorama viewer">
        <canvas id="viewer" aria-label="Interactive 360 panorama canvas"></canvas>
        <div id="emptyState" class="empty-state">
          <div>
            <p class="kicker">360 Viewer</p>
            <h1>Loading panorama</h1>
            <p>This shared view is loading the assigned 360 image.</p>
          </div>
        </div>
        <div id="dropOverlay" class="drop-overlay"><span>Drop panorama image</span></div>
        <button id="exitFullscreen" class="exit-fullscreen hidden" type="button" title="Exit fullscreen" aria-label="Exit fullscreen">x</button>
      </section>
      <aside class="tool-panel" aria-label="Viewer controls">
        <div class="brand-row">
          <div>
            <p class="kicker">Ashva 3D View</p>
            <h2>${escapeHtml(title)}</h2>
          </div>
          <button id="resetView" class="icon-button" type="button" title="Reset view" aria-label="Reset view"><span aria-hidden="true">↺</span></button>
        </div>
        <label class="upload-zone" for="imageInput">
          <input id="imageInput" type="file" accept="image/jpeg,image/png,image/webp">
          <span class="upload-icon" aria-hidden="true">+</span>
          <span><strong>Choose panorama</strong><small>JPG, PNG, or WebP</small></span>
        </label>
        <div class="control-group">
          <label for="modeSelect">View mode</label>
          <select id="modeSelect">
            <option value="mono">Normal 3D view</option>
            <option value="cardboard">Google Cardboard split view</option>
          </select>
        </div>
        <div class="button-grid">
          <button id="fullscreenBtn" type="button">Fullscreen</button>
          <button id="cardboardBtn" type="button">Cardboard</button>
          <button id="motionBtn" type="button">Motion</button>
        </div>
        <div class="control-group"><label for="fovRange">Zoom</label><input id="fovRange" type="range" min="35" max="95" value="70"></div>
        <div class="control-group"><label for="stereoRange">Cardboard depth</label><input id="stereoRange" type="range" min="0" max="7" value="3" step="0.5"></div>
        <div class="hotspot-editor">
          <div class="section-title"><h3>Custom Links</h3><button id="addHotspot" type="button">Add</button></div>
          <p class="hint">Point the view at a location, then add a label and URL.</p>
          <div class="field-stack">
            <label>Project name<input id="projectName" type="text" placeholder="as005"></label>
            <label>Label<input id="hotspotLabel" type="text" placeholder="room/view1"></label>
            <label>Link<span class="copy-field"><input id="hotspotUrl" type="url" placeholder="https://www.ashva.ae/3dviewdesigns/as005/room/view1/"><button id="copyLink" type="button">Copy</button></span></label>
          </div>
          <div id="hotspotList" class="hotspot-list" aria-live="polite"></div>
        </div>
        <div class="tips">
          <p><strong>Controls</strong></p>
          <p>Drag to look around. Use the mouse wheel or zoom slider to zoom. In Cardboard mode, rotate the phone or drag before placing it into the headset.</p>
        </div>
      </aside>
    </main>
    <script src="app.js"></script>
  </body>
</html>
`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function downloadPackage() {
    const path = routePath();
    const file = panoramaFile.files[0];
    if (!path) {
      setStatus("Enter project name and view path first.");
      return;
    }
    if (!file) {
      setStatus("Choose a panorama image first.");
      return;
    }

    setStatus("Preparing viewer package...");
    const ext = imageExtension(file);
    const panoramaName = `panorama.${ext}`;
    const title = `${slugifyPath(projectName.value).toUpperCase()} ${slugifyPath(viewPath.value).replace(/\//g, " ")}`;
    const viewConfig = JSON.stringify({
      panorama: panoramaName,
      hotspots: collectHotspots()
    }, null, 2);

    const [viewerScript, viewerStyles, imageBytes] = await Promise.all([
      fetch("../3dviewdesigns/as005/room/view1/app.js").then((response) => response.text()),
      fetch("../3dviewdesigns/as005/room/view1/styles.css").then((response) => response.text()),
      file.arrayBuffer()
    ]);

    const files = [
      { name: `${path}/index.html`, data: viewerIndex(title) },
      { name: `${path}/styles.css`, data: viewerStyles },
      { name: `${path}/app.js`, data: viewerScript },
      { name: `${path}/view.json`, data: viewConfig },
      { name: `${path}/${panoramaName}`, data: imageBytes }
    ];

    const zip = buildZip(files);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([zip], { type: "application/zip" }));
    link.download = `${slugifyPath(projectName.value)}-${slugifyPath(viewPath.value).replace(/\//g, "-")}.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
    setStatus("ZIP downloaded. Upload its 3dviewdesigns folder to GitHub to make the link live.");
  }

  function crc32(bytes) {
    let crc = -1;
    for (let i = 0; i < bytes.length; i += 1) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  const crcTable = (function () {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i += 1) {
      let c = i;
      for (let j = 0; j < 8; j += 1) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c >>> 0;
    }
    return table;
  }());

  function toBytes(data) {
    if (data instanceof ArrayBuffer) {
      return new Uint8Array(data);
    }
    return new TextEncoder().encode(data);
  }

  function buildZip(files) {
    const chunks = [];
    const central = [];
    let offset = 0;

    files.forEach(function (file) {
      const nameBytes = new TextEncoder().encode(file.name);
      const dataBytes = toBytes(file.data);
      const crc = crc32(dataBytes);
      const local = new Uint8Array(30 + nameBytes.length);
      const view = new DataView(local.buffer);
      view.setUint32(0, 0x04034b50, true);
      view.setUint16(4, 20, true);
      view.setUint16(6, 0, true);
      view.setUint16(8, 0, true);
      view.setUint32(14, crc, true);
      view.setUint32(18, dataBytes.length, true);
      view.setUint32(22, dataBytes.length, true);
      view.setUint16(26, nameBytes.length, true);
      local.set(nameBytes, 30);
      chunks.push(local, dataBytes);

      const dir = new Uint8Array(46 + nameBytes.length);
      const dirView = new DataView(dir.buffer);
      dirView.setUint32(0, 0x02014b50, true);
      dirView.setUint16(4, 20, true);
      dirView.setUint16(6, 20, true);
      dirView.setUint16(8, 0, true);
      dirView.setUint16(10, 0, true);
      dirView.setUint32(16, crc, true);
      dirView.setUint32(20, dataBytes.length, true);
      dirView.setUint32(24, dataBytes.length, true);
      dirView.setUint16(28, nameBytes.length, true);
      dirView.setUint32(42, offset, true);
      dir.set(nameBytes, 46);
      central.push(dir);
      offset += local.length + dataBytes.length;
    });

    const centralSize = central.reduce((sum, item) => sum + item.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, files.length, true);
    endView.setUint16(10, files.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    return new Blob([...chunks, ...central, end]);
  }

  projectName.addEventListener("input", updateLink);
  viewPath.addEventListener("input", updateLink);
  addHotspot.addEventListener("click", function () {
    addHotspotRow();
  });
  copyLink.addEventListener("click", async function () {
    if (!shareLink.value) return;
    await navigator.clipboard.writeText(shareLink.value);
    copyLink.textContent = "Copied";
    window.setTimeout(function () {
      copyLink.textContent = "Copy";
    }, 1200);
  });
  panoramaFile.addEventListener("change", function () {
    const file = panoramaFile.files[0];
    if (!file) return;
    fileName.textContent = file.name;
    if (panoramaObjectUrl) {
      URL.revokeObjectURL(panoramaObjectUrl);
    }
    panoramaObjectUrl = URL.createObjectURL(file);
    previewImage.src = panoramaObjectUrl;
    previewBox.classList.add("has-image");
  });
  downloadZip.addEventListener("click", downloadPackage);

  projectName.value = "as005";
  viewPath.value = "room/view1";
  addHotspotRow({
    label: "Ashva website",
    url: "https://www.ashva.ae/",
    yaw: 18,
    pitch: 0
  });
  updateLink();
}());
