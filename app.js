(function () {
  "use strict";

  const canvas = document.getElementById("viewer");
  const emptyState = document.getElementById("emptyState");
  const dropOverlay = document.getElementById("dropOverlay");
  const imageInput = document.getElementById("imageInput");
  const modeSelect = document.getElementById("modeSelect");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const cardboardBtn = document.getElementById("cardboardBtn");
  const motionBtn = document.getElementById("motionBtn");
  const resetView = document.getElementById("resetView");
  const fovRange = document.getElementById("fovRange");
  const stereoRange = document.getElementById("stereoRange");
  const addHotspot = document.getElementById("addHotspot");
  const projectName = document.getElementById("projectName");
  const hotspotLabel = document.getElementById("hotspotLabel");
  const hotspotUrl = document.getElementById("hotspotUrl");
  const copyLink = document.getElementById("copyLink");
  const hotspotList = document.getElementById("hotspotList");
  const exitFullscreen = document.getElementById("exitFullscreen");
  const viewerPanel = document.querySelector(".viewer-panel");
  const pageParams = new URLSearchParams(window.location.search);
  const localHostnames = ["localhost", "127.0.0.1", ""];
  const isLocalViewer = window.location.protocol === "file:" || localHostnames.includes(window.location.hostname);
  const editorMode = isLocalViewer && (pageParams.get("edit") === "1" || pageParams.get("admin") === "1");
  const embedMode = pageParams.get("embed") === "1";

  document.body.classList.toggle("editor-mode", editorMode);
  document.body.classList.toggle("viewer-mode", !editorMode);
  document.body.classList.toggle("embed-mode", embedMode);

  const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) {
    emptyState.querySelector("h1").textContent = "WebGL is not available";
    emptyState.querySelector("p").textContent = "Try opening this app in a modern browser with hardware acceleration enabled.";
    return;
  }

  const state = {
    yaw: 0,
    pitch: 0,
    fov: 70,
    stereoOffset: 3,
    texture: null,
    textureReady: false,
    dragging: false,
    dragX: 0,
    dragY: 0,
    pointerId: null,
    motionEnabled: false,
    baseMotionYaw: null,
    baseMotionPitch: null,
    hotspots: []
  };

  const program = createProgram(gl, vertexShaderSource(), fragmentShaderSource());
  const attributes = {
    position: gl.getAttribLocation(program, "aPosition"),
    uv: gl.getAttribLocation(program, "aUv")
  };
  const uniforms = {
    matrix: gl.getUniformLocation(program, "uMatrix"),
    texture: gl.getUniformLocation(program, "uTexture")
  };

  const mesh = createSphereMesh(72, 36);
  const positionBuffer = makeBuffer(gl.ARRAY_BUFFER, new Float32Array(mesh.positions));
  const uvBuffer = makeBuffer(gl.ARRAY_BUFFER, new Float32Array(mesh.uvs));
  const indexBuffer = makeBuffer(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices));

  gl.useProgram(program);
  gl.uniform1i(uniforms.texture, 0);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.FRONT);
  gl.disable(gl.DEPTH_TEST);

  function vertexShaderSource() {
    return [
      "attribute vec3 aPosition;",
      "attribute vec2 aUv;",
      "uniform mat4 uMatrix;",
      "varying vec2 vUv;",
      "void main() {",
      "  vUv = aUv;",
      "  gl_Position = uMatrix * vec4(aPosition, 1.0);",
      "}"
    ].join("\n");
  }

  function fragmentShaderSource() {
    return [
      "precision mediump float;",
      "uniform sampler2D uTexture;",
      "varying vec2 vUv;",
      "void main() {",
      "  gl_FragColor = texture2D(uTexture, vUv);",
      "}"
    ].join("\n");
  }

  function createShader(glContext, type, source) {
    const shader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);
    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
      throw new Error(glContext.getShaderInfoLog(shader) || "Shader compile failed");
    }
    return shader;
  }

  function createProgram(glContext, vertexSource, fragmentSource) {
    const nextProgram = glContext.createProgram();
    glContext.attachShader(nextProgram, createShader(glContext, glContext.VERTEX_SHADER, vertexSource));
    glContext.attachShader(nextProgram, createShader(glContext, glContext.FRAGMENT_SHADER, fragmentSource));
    glContext.linkProgram(nextProgram);
    if (!glContext.getProgramParameter(nextProgram, glContext.LINK_STATUS)) {
      throw new Error(glContext.getProgramInfoLog(nextProgram) || "Program link failed");
    }
    return nextProgram;
  }

  function makeBuffer(type, data) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buffer;
  }

  function createSphereMesh(widthSegments, heightSegments) {
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let y = 0; y <= heightSegments; y += 1) {
      const v = y / heightSegments;
      const theta = v * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let x = 0; x <= widthSegments; x += 1) {
        const u = x / widthSegments;
        const phi = u * Math.PI * 2;
        positions.push(
          Math.sin(phi) * sinTheta,
          cosTheta,
          Math.cos(phi) * sinTheta
        );
        uvs.push(1 - u, v);
      }
    }

    for (let y = 0; y < heightSegments; y += 1) {
      for (let x = 0; x < widthSegments; x += 1) {
        const first = y * (widthSegments + 1) + x;
        const second = first + widthSegments + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return { positions, uvs, indices };
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function perspective(fovRadians, aspect, near, far) {
    const f = 1 / Math.tan(fovRadians / 2);
    const nf = 1 / (near - far);
    return [
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, (2 * far * near) * nf, 0
    ];
  }

  function multiply(a, b) {
    const out = new Array(16);
    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        out[col * 4 + row] =
          a[0 * 4 + row] * b[col * 4 + 0] +
          a[1 * 4 + row] * b[col * 4 + 1] +
          a[2 * 4 + row] * b[col * 4 + 2] +
          a[3 * 4 + row] * b[col * 4 + 3];
      }
    }
    return out;
  }

  function rotationX(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ];
  }

  function rotationY(angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ];
  }

  function matrixForView(yawDegrees, pitchDegrees, aspect) {
    const projection = perspective(degToRad(state.fov), aspect, 0.01, 10);
    const yaw = rotationY(degToRad(yawDegrees));
    const pitch = rotationX(degToRad(pitchDegrees));
    return multiply(projection, multiply(pitch, yaw));
  }

  function drawViewport(x, y, width, height, yawOffset) {
    gl.viewport(x, y, width, height);
    gl.uniformMatrix4fv(
      uniforms.matrix,
      false,
      new Float32Array(matrixForView(state.yaw + yawOffset, state.pitch, width / height))
    );
    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
  }

  function draw() {
    resizeCanvas();
    gl.clearColor(0.07, 0.08, 0.1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (state.textureReady) {
      gl.useProgram(program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, state.texture);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(attributes.position);
      gl.vertexAttribPointer(attributes.position, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.enableVertexAttribArray(attributes.uv);
      gl.vertexAttribPointer(attributes.uv, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      if (modeSelect.value === "cardboard") {
        const half = Math.floor(canvas.width / 2);
        drawViewport(0, 0, half, canvas.height, -state.stereoOffset / 2);
        drawViewport(half, 0, canvas.width - half, canvas.height, state.stereoOffset / 2);
        drawDivider();
      } else {
        drawViewport(0, 0, canvas.width, canvas.height, 0);
      }
    }

    updateHotspots();
    requestAnimationFrame(draw);
  }

  function drawDivider() {
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.SCISSOR_TEST);
    const x = Math.floor(canvas.width / 2) - 1;
    gl.scissor(x, 0, 2, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
  }

  function loadImageFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = function () {
      setTexture(image);
      URL.revokeObjectURL(url);
      emptyState.classList.add("hidden");
    };
    image.src = url;
  }

  function loadImageUrl(url) {
    const image = new Image();
    image.onload = function () {
      setTexture(image);
      emptyState.classList.add("hidden");
    };
    image.onerror = function () {};
    image.src = url;
  }

  function setTexture(image) {
    if (state.texture) {
      gl.deleteTexture(state.texture);
    }

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    state.texture = texture;
    state.textureReady = true;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function normalizeYaw(degrees) {
    return ((degrees % 360) + 360) % 360;
  }

  function slugifyPath(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\\/g, "/")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9/]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/\/+/g, "/")
      .replace(/(^[-/]+|[-/]+$)/g, "");
  }

  function generatedLink() {
    const project = slugifyPath(projectName.value);
    const label = slugifyPath(hotspotLabel.value);
    if (!project || !label) {
      return "";
    }
    return `https://www.ashva.ae/3dviewdesigns/${project}/${label}/`;
  }

  function updateGeneratedLink() {
    hotspotUrl.value = generatedLink();
  }

  async function copyGeneratedLink() {
    const link = hotspotUrl.value.trim() || generatedLink();
    if (!link) {
      hotspotUrl.focus();
      return;
    }

    hotspotUrl.value = link;

    try {
      await navigator.clipboard.writeText(link);
    } catch (error) {
      hotspotUrl.focus();
      hotspotUrl.select();
      document.execCommand("copy");
    }

    copyLink.textContent = "Copied";
    window.setTimeout(function () {
      copyLink.textContent = "Copy";
    }, 1300);
  }

  function angleDelta(a, b) {
    return ((a - b + 540) % 360) - 180;
  }

  function isCardboardActive() {
    return modeSelect.value === "cardboard";
  }

  function enterCardboard() {
    modeSelect.value = "cardboard";
    document.body.classList.add("cardboard-active");
    exitFullscreen.classList.remove("hidden");
    if (viewerPanel.requestFullscreen) {
      viewerPanel.requestFullscreen().catch(function () {});
    }
  }

  function enterFullscreen() {
    if (viewerPanel.requestFullscreen) {
      viewerPanel.requestFullscreen().catch(function () {});
    }
  }

  function exitCardboard() {
    modeSelect.value = "mono";
    document.body.classList.remove("cardboard-active");
    exitFullscreen.classList.add("hidden");
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(function () {});
    }
  }

  function exitFullscreenView() {
    modeSelect.value = "mono";
    document.body.classList.remove("cardboard-active");
    exitFullscreen.classList.add("hidden");
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(function () {});
    }
  }

  function resetCamera() {
    state.yaw = 0;
    state.pitch = 0;
    state.baseMotionYaw = null;
    state.baseMotionPitch = null;
  }

  function updateModeClass() {
    if (isCardboardActive()) {
      document.body.classList.add("cardboard-active");
      exitFullscreen.classList.remove("hidden");
    } else {
      document.body.classList.remove("cardboard-active");
      exitFullscreen.classList.toggle("hidden", !document.fullscreenElement);
    }
  }

  function placeHotspotElement(hotspot) {
    const element = document.createElement("a");
    element.className = "hotspot-marker";
    element.href = hotspot.url;
    element.target = "_blank";
    element.rel = "noopener";
    element.textContent = hotspot.label;
    viewerPanel.appendChild(element);
    hotspot.element = element;
  }

  function updateHotspots() {
    const panelRect = viewerPanel.getBoundingClientRect();
    const centerX = panelRect.width / 2;
    const centerY = panelRect.height / 2;
    const horizontalFov = state.fov * (panelRect.width / Math.max(1, panelRect.height));
    const verticalFov = state.fov;

    state.hotspots.forEach(function (hotspot) {
      if (!hotspot.element) {
        placeHotspotElement(hotspot);
      }

      if (isCardboardActive()) {
        hotspot.element.classList.add("hidden");
        return;
      }

      const dx = angleDelta(hotspot.yaw, normalizeYaw(state.yaw));
      const dy = hotspot.pitch - state.pitch;
      const visible = Math.abs(dx) < horizontalFov / 2 && Math.abs(dy) < verticalFov / 2;

      hotspot.element.classList.toggle("hidden", !visible);
      if (visible) {
        hotspot.element.style.left = `${centerX + (dx / horizontalFov) * panelRect.width}px`;
        hotspot.element.style.top = `${centerY - (dy / verticalFov) * panelRect.height}px`;
      }
    });
  }

  function renderHotspotList() {
    hotspotList.innerHTML = "";
    if (!state.hotspots.length) {
      const empty = document.createElement("small");
      empty.textContent = "No links added yet.";
      hotspotList.appendChild(empty);
      return;
    }

    state.hotspots.forEach(function (hotspot, index) {
      const item = document.createElement("div");
      item.className = "hotspot-item";

      const text = document.createElement("div");
      const link = document.createElement("a");
      link.href = hotspot.url;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = hotspot.label;
      const meta = document.createElement("small");
      meta.textContent = `Yaw ${Math.round(hotspot.yaw)}°, pitch ${Math.round(hotspot.pitch)}°`;
      text.append(link, meta);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.title = "Remove link";
      remove.setAttribute("aria-label", `Remove ${hotspot.label}`);
      remove.textContent = "×";
      remove.addEventListener("click", function () {
        if (hotspot.element) {
          hotspot.element.remove();
        }
        state.hotspots.splice(index, 1);
        renderHotspotList();
      });

      item.append(text, remove);
      hotspotList.appendChild(item);
    });
  }

  function addHostedHotspots(hotspots) {
    if (!Array.isArray(hotspots)) {
      return;
    }

    hotspots.forEach(function (hotspot) {
      if (!hotspot || !hotspot.url) {
        return;
      }

      state.hotspots.push({
        label: hotspot.label || hotspot.text || "Link",
        url: hotspot.url,
        yaw: normalizeYaw(Number(hotspot.yaw) || 0),
        pitch: clamp(Number(hotspot.pitch) || 0, -85, 85),
        element: null
      });
    });
    renderHotspotList();
  }

  async function loadHostedView() {
    const imageFromUrl = pageParams.get("image");
    if (imageFromUrl) {
      loadImageUrl(imageFromUrl);
    }

    try {
      const response = await fetch("view.json", { cache: "no-store" });
      if (response.ok) {
        const config = await response.json();
        if (!imageFromUrl && config.panorama) {
          loadImageUrl(config.panorama);
        }
        addHostedHotspots(config.hotspots);
        return;
      }
    } catch (error) {}

    if (!imageFromUrl) {
      loadImageUrl("panorama.jpg");
    }
  }

  imageInput.addEventListener("change", function () {
    loadImageFile(imageInput.files[0]);
  });

  canvas.addEventListener("pointerdown", function (event) {
    state.dragging = true;
    state.dragX = event.clientX;
    state.dragY = event.clientY;
    state.pointerId = event.pointerId;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", function (event) {
    if (!state.dragging || state.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - state.dragX;
    const dy = event.clientY - state.dragY;
    state.dragX = event.clientX;
    state.dragY = event.clientY;
    state.yaw = normalizeYaw(state.yaw - dx * 0.14);
    state.pitch = clamp(state.pitch - dy * 0.14, -85, 85);
  });

  function stopDrag(event) {
    if (state.pointerId === event.pointerId) {
      state.dragging = false;
      state.pointerId = null;
    }
  }

  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);

  canvas.addEventListener("wheel", function (event) {
    event.preventDefault();
    state.fov = clamp(state.fov + Math.sign(event.deltaY) * 4, 35, 95);
    fovRange.value = String(state.fov);
  }, { passive: false });

  document.addEventListener("dragover", function (event) {
    event.preventDefault();
    dropOverlay.classList.add("visible");
  });

  document.addEventListener("dragleave", function (event) {
    if (event.clientX === 0 && event.clientY === 0) {
      dropOverlay.classList.remove("visible");
    }
  });

  document.addEventListener("drop", function (event) {
    event.preventDefault();
    dropOverlay.classList.remove("visible");
    loadImageFile(event.dataTransfer.files[0]);
  });

  fovRange.addEventListener("input", function () {
    state.fov = Number(fovRange.value);
  });

  stereoRange.addEventListener("input", function () {
    state.stereoOffset = Number(stereoRange.value);
  });

  modeSelect.addEventListener("change", updateModeClass);
  fullscreenBtn.addEventListener("click", enterFullscreen);
  cardboardBtn.addEventListener("click", enterCardboard);
  exitFullscreen.addEventListener("click", exitFullscreenView);
  resetView.addEventListener("click", resetCamera);

  addHotspot.addEventListener("click", function () {
    const label = hotspotLabel.value.trim() || "Link";
    const url = hotspotUrl.value.trim() || generatedLink();
    if (!url) {
      hotspotUrl.focus();
      return;
    }

    state.hotspots.push({
      label,
      url,
      yaw: normalizeYaw(state.yaw),
      pitch: state.pitch,
      element: null
    });
    hotspotLabel.value = "";
    hotspotUrl.value = "";
    renderHotspotList();
  });

  projectName.addEventListener("input", updateGeneratedLink);
  hotspotLabel.addEventListener("input", updateGeneratedLink);
  copyLink.addEventListener("click", copyGeneratedLink);

  motionBtn.addEventListener("click", async function () {
    if (typeof DeviceOrientationEvent === "undefined") {
      motionBtn.textContent = "Unavailable";
      return;
    }

    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission !== "granted") {
          return;
        }
      } catch (error) {
        return;
      }
    }

    state.motionEnabled = !state.motionEnabled;
    motionBtn.textContent = state.motionEnabled ? "Motion On" : "Motion";
    state.baseMotionYaw = null;
    state.baseMotionPitch = null;
  });

  window.addEventListener("deviceorientation", function (event) {
    if (!state.motionEnabled || event.alpha === null || event.beta === null) {
      return;
    }

    if (state.baseMotionYaw === null) {
      state.baseMotionYaw = event.alpha;
      state.baseMotionPitch = event.beta;
    }

    state.yaw = normalizeYaw(event.alpha - state.baseMotionYaw);
    state.pitch = clamp(event.beta - state.baseMotionPitch, -85, 85);
  });

  document.addEventListener("fullscreenchange", function () {
    const isViewerFullscreen = document.fullscreenElement === viewerPanel;
    exitFullscreen.classList.toggle("hidden", !isViewerFullscreen);

    if (!document.fullscreenElement && isCardboardActive()) {
      modeSelect.value = "mono";
      updateModeClass();
    }
  });

  window.addEventListener("resize", resizeCanvas);

  renderHotspotList();
  loadHostedView();
  requestAnimationFrame(draw);
}());
