const storageKey = "design-consultancy-project-tracker-v8";

const options = {
  designStages: ["PRELIMINARY", "FINAL", "TENDER"],
  disciplines: ["Architecture", "STRUCTURE", "ELECTRICAL", "Mechanical", "Plumbing", "DCD"],
  authorities: ["Dubai Municipality", "DDA", "Dubai South", "Trakhees", "Emaar", "Nakheel", "Master Developer", "DEWA - ELE", "DEWA - Water", "DCD"],
  projectAuthorities: ["Dubai Municipality", "DDA", "Dubai South", "Trakhees"],
  dailyFor: ["Client", "Contractor", "Dubai Municipality", "DDA", "Dubai South", "Trakhees", "Emaar", "Nakheel", "Master Developer", "DEWA - ELE", "DEWA - Water", "DCD"],
  dailyStatuses: ["In Progress", "Submitted", "Done"],
  nocStatuses: ["Applied", "Approved", "Not Applicable", "Rejected"],
  documentStatuses: ["Pending", "Received", "Not Applicable", "Missing"],
  projectStatuses: ["Active", "On Hold", "Completed", "Cancelled"],
  priorities: ["High", "Medium", "Low"],
  designStatuses: ["Not Started", "In Progress", "On Track", "At Risk", "Delayed", "Completed", "Minor Comments"],
  approvalStatuses: ["Not Started", "Submitted", "In Progress", "Minor Comments", "Rejected", "Approved", "Delayed"],
  constructionStatuses: ["Not Started", "Mobilized", "In Progress", "On Track", "At Risk", "Delayed", "Completed"],
};

const seedProjects = [
  seedProject({
    code: "AS005",
    name: "PROPOSED B+G+1+Roof Villa",
    client: "R Mdhavan",
    location: "Meydan District One",
    status: "Active",
    phase: "Final Design",
    priority: "High",
    lead: "Anil",
    lpo: "2025-08-01",
    target: "2026-06-30",
    complete: 58,
    notes: "Soil report and site-services delay affected final design submission.",
    design: [
      ["PRELIMINARY", "Issue of LPO", "Architecture", "Anil", "2025-08-01", "0", "2025-08-01", "2025-08-01", "2025-08-01", "Completed", ""],
      ["PRELIMINARY", "Preliminary designs to client", "Architecture", "Anil", "2025-08-02", "28", "2025-08-29", "2025-09-01", "", "Minor Comments", "3 days late submission to client."],
      ["PRELIMINARY", "Preliminary approved by Client", "Architecture", "Anil", "2025-09-01", "10", "2025-09-08", "", "", "In Progress", "Awaiting final client confirmation."],
      ["PRELIMINARY", "Preliminary submission", "Architecture", "Hassan", "2025-09-01", "10", "2025-09-18", "2025-09-11", "", "On Track", "Submitted 7 days ahead."],
      ["FINAL", "Final design submissions", "Architecture", "Hassan", "2025-11-25", "10", "2025-12-29", "2025-12-18", "", "Delayed", "14 days delay in finalising soil report and site services."],
    ],
    approvals: [
      ["Master Developer", "Submission", "2026-01-29", "", "2026-02-15", "", "Minor Comments", "High", "Hassan", "Minor comments received.", "Close comments and resubmit."],
      ["Dubai Municipality", "Initial Approval", "2026-03-24", "", "2026-03-24", "2026-03-24", "Approved", "High", "Hassan", "Approved.", "Proceed with final application."],
      ["DDA", "Submission", "2026-04-25", "", "2026-05-20", "", "Rejected", "High", "Hassan", "960Kw only.", "Revise load schedule."],
    ],
    construction: [["Tender / Contractor Selection", "TBC", "2026-04-24", "2026-05-25", "", "", "0", "Not Started", "High", "Final authority approval pending.", "Prepare tender list."]],
  }),
  seedProject({
    code: "AS006",
    name: "Arabian Ranches Peter Erwee",
    client: "Peter Erwee",
    location: "Arabian Ranches",
    authority: "Dubai Municipality",
    developer: "Dubai Properties",
    phase: "Preliminary Design",
    priority: "Medium",
  }),
  seedProject({
    code: "AS007",
    name: "Aghora JAFZA Mezzanine",
    client: "Aghora",
    location: "JAFZA",
    authority: "Trakhees",
    developer: "JAFZA",
    phase: "Authority Approvals",
    priority: "High",
  }),
  seedProject({
    code: "AS008",
    name: "Airsoft Games - KIZAD Ideaplus",
    client: "Ideaplus",
    location: "KIZAD",
    authority: "Dubai Municipality",
    developer: "KIZAD",
    phase: "Preliminary Design",
    priority: "Medium",
  }),
  seedProject({
    code: "AS009",
    name: "Dubai Safari Park - Elephant Enclosure",
    client: "Dubai Safari Park",
    location: "Dubai Safari Park",
    authority: "Dubai Municipality",
    developer: "Dubai Safari Park",
    phase: "Preliminary Design",
    priority: "Medium",
  }),
  seedProject({
    code: "AS010",
    name: "Bayan - As-Built Drawings",
    client: "Bayan",
    authority: "Dubai Municipality",
    phase: "Design",
    priority: "Medium",
  }),
  seedProject({
    code: "AS012",
    name: "Battlepark Warehouse Mezzanine - Al Quoz",
    client: "Battlepark",
    location: "Al Quoz",
    authority: "Dubai Municipality",
    phase: "Authority Approvals",
    priority: "High",
  }),
];

const designColumns = ["Stage Group", "Stage Description", "Discipline", "Owner", "Planned Start", "Duration Days", "ETS", "Submission Date", "Actual Approval", "Status", "Delay Reason / Action"];
const approvalColumns = ["Authority", "Application / Milestone", "Submission Date", "Resubmission Date", "Target Approval", "Actual Approval", "Status", "Priority", "Owner", "Dependency / Comment", "Next Action"];
const constructionColumns = ["Construction Stage", "Contractor / Party", "Planned Start", "Planned Finish", "Actual Start", "Actual Finish", "% Complete", "Status", "Priority", "Blocker / Delay Reason", "Next Site Action"];
const dailyTaskColumns = ["Daily Task", "Description", "Project Number", "For", "Priority", "Assigned To", "Status"];
const nocItems = [
  "DEWA - Electricity",
  "DEWA - Water",
  "Telecom - Etisalat",
  "Telecom - DU",
  "Drainage",
  "RTA - Temporary Fence/access",
  "RTA - Shoring/Excavation",
  "RTA - Gate Level",
  "Demarcation",
  "Soil Report",
  "Site Survey",
];
const documentItems = ["Site Plan", "Owner Emirates ID", "Consultant Appointment Letter", "Soil Report", "Site Survey Report", "Existing Drawings"];
const seedDailyTasks = [];

function seedProject(project) {
  const authority = project.authority || "Dubai Municipality";
  const priority = project.priority || "Medium";
  return {
    client: "",
    location: "",
    status: "Active",
    phase: "Preliminary Design",
    priority,
    lead: "",
    authority,
    developer: "",
    lpo: "",
    target: "",
    complete: 0,
    notes: "",
    design: [["PRELIMINARY", "Preliminary design", "Architecture", "", "", "", "", "", "", "Not Started", ""]],
    approvals: [[authority, "Submission", "", "", "", "", "Not Started", priority, "", "", ""]],
    construction: [["Tender / Contractor Selection", "", "", "", "", "", "0", "Not Started", priority, "", ""]],
    ...project,
  };
}

let state = loadState();
let currentView = "dashboard";
let currentProject = state.projects[0]?.code || "";
let currentOverallProject = "";
let currentRegisterAuthority = "";

const appView = document.getElementById("appView");
const viewTitle = document.getElementById("viewTitle");
const viewEyebrow = document.getElementById("viewEyebrow");
const projectList = document.getElementById("projectList");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    render();
  });
});

document.getElementById("addProjectBtn").addEventListener("click", addProject);
document.getElementById("deleteProjectBtn").addEventListener("click", deleteProject);
searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);

render();

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return normalizeState(cleanupDailyTasks({ projects: structuredClone(seedProjects), dailyTasks: structuredClone(seedDailyTasks), completedDailyTasks: [] }));
  try {
    const parsed = JSON.parse(saved);
    if (!parsed.projects) return normalizeState(cleanupDailyTasks({ projects: structuredClone(seedProjects), dailyTasks: structuredClone(seedDailyTasks), completedDailyTasks: [] }));
    if (!Array.isArray(parsed.dailyTasks)) parsed.dailyTasks = [];
    if (!Array.isArray(parsed.completedDailyTasks)) parsed.completedDailyTasks = [];
    return normalizeState(cleanupDailyTasks(parsed));
  } catch {
    return normalizeState(cleanupDailyTasks({ projects: structuredClone(seedProjects), dailyTasks: structuredClone(seedDailyTasks), completedDailyTasks: [] }));
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function render() {
  renderSidebar();
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.view === currentView));

  if (currentView === "dashboard") renderDashboard();
  if (currentView === "overall") renderOverall();
  if (currentView === "projects") renderProjectIndex();
  if (currentView === "project") renderProject(currentProject);
}

function renderSidebar() {
  projectList.innerHTML = "";
  filteredProjects().forEach((project) => {
    const button = document.createElement("button");
    button.className = `project-tab ${currentView === "project" && currentProject === project.code ? "active" : ""}`;
    button.dataset.code = project.code;
    button.innerHTML = `<strong>${escapeHtml(project.code)}</strong><small>${escapeHtml(project.name)}</small>`;
    button.addEventListener("click", () => {
      currentProject = project.code;
      currentView = "project";
      render();
    });
    projectList.appendChild(button);
  });
}

function filteredProjects() {
  const q = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  return sortedProjects(state.projects).filter((project) => {
    const haystack = [project.code, project.name, project.client, project.location, project.status, project.phase, project.authority, project.developer, project.lead].join(" ").toLowerCase();
    return (!q || haystack.includes(q)) && (!status || project.status === status);
  });
}

function sortedProjects(projects) {
  return [...projects].sort(compareProjectsByCode);
}

function compareProjectsByCode(a, b) {
  const aCode = normalizeProjectCode(a.code);
  const bCode = normalizeProjectCode(b.code);
  return aCode.prefix.localeCompare(bCode.prefix, undefined, { sensitivity: "base" }) || aCode.number - bCode.number || aCode.suffix.localeCompare(bCode.suffix, undefined, { numeric: true, sensitivity: "base" });
}

function normalizeProjectCode(code) {
  const value = String(code || "").trim();
  const match = value.match(/^([a-zA-Z]*?)\s*0*(\d+)\s*(.*)$/);
  return {
    prefix: match?.[1] || value,
    number: match ? Number(match[2]) : Number.MAX_SAFE_INTEGER,
    suffix: match?.[3] || "",
  };
}

function renderDashboard() {
  viewEyebrow.textContent = "Portfolio";
  viewTitle.textContent = "Operations Dashboard";
  const projects = filteredProjects();
  const tracker = flattenTracker(projects);
  const kpis = [
    ["Total Projects", projects.length],
    ["Active Projects", projects.filter((p) => p.status === "Active").length],
    ["Design Delayed", tracker.filter((r) => r.type === "Design" && ["Delayed", "At Risk"].includes(r.status)).length],
    ["Approvals Pending", tracker.filter((r) => r.type === "Approval" && ["Submitted", "In Progress", "Minor Comments"].includes(r.status)).length],
    ["Construction At Risk", tracker.filter((r) => r.type === "Construction" && ["Delayed", "At Risk"].includes(r.status)).length],
    ["Avg Completion", `${Math.round(avg(projects.map((p) => Number(p.complete) || 0)))}%`],
  ];

  appView.innerHTML = `
    <div class="kpis">${kpis.map(([label, value]) => `<div class="kpi"><span>${label}</span><strong>${value}</strong></div>`).join("")}</div>
    <div class="grid-2">
      <div class="panel">
        <div class="panel-title purple">Management Attention</div>
        ${projectTable(projects)}
      </div>
      <div class="panel">
        <div class="panel-title teal">Authority Approvals Snapshot</div>
        ${statusSummaryTable(tracker.filter((r) => r.type === "Approval"), ["Approved", "In Progress", "Minor Comments", "Rejected", "Delayed", "Not Started"])}
      </div>
      <div class="panel">
        <div class="panel-title blue">Design Status By Phase</div>
        ${statusSummaryTable(tracker.filter((r) => r.type === "Design"), ["Completed", "On Track", "In Progress", "At Risk", "Delayed"])}
      </div>
      <div class="panel">
        <div class="panel-title amber">Construction Pipeline</div>
        ${statusSummaryTable(tracker.filter((r) => r.type === "Construction"), ["Not Started", "In Progress", "On Track", "At Risk", "Completed"])}
      </div>
    </div>`;
}

function renderOverall() {
  viewEyebrow.textContent = "Rollup";
  viewTitle.textContent = "Overall Tracker";
  const dailyCount = state.dailyTasks.length;
  cleanupDailyTasks(state);
  if (dailyCount !== state.dailyTasks.length) saveState();
  const projects = filteredProjects();
  const filteredOverallProjects = currentOverallProject ? projects.filter((project) => project.code === currentOverallProject) : projects;
  if (currentOverallProject && !filteredOverallProjects.length) currentOverallProject = "";
  const rows = flattenTracker(currentOverallProject ? filteredOverallProjects : projects);
  appView.innerHTML = `
    ${dailyTasksPanel()}
    <div class="panel">
      <div class="panel-title"><span>Combined Tracker</span>${overallProjectFilter(projects)}</div>
      <div class="table-wrap">
        <table>
          <thead><tr>${["Project Code", "Project", "Type", "Stage / Authority", "Milestone", "Owner / Party", "Start / Submission", "Target", "Actual", "Status", "Priority", "Comment", "Next Action"].map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.map(overallRow).join("")}</tbody>
        </table>
      </div>
    </div>`;
  bindDailyTasks();
  bindOverallFilters();
}

function renderProjectIndex() {
  viewEyebrow.textContent = "Register";
  viewTitle.textContent = "Overall Projects";
  const projects = filteredProjects();
  const registerProjects = currentRegisterAuthority ? projects.filter((project) => project.authority === currentRegisterAuthority) : projects;
  appView.innerHTML = `<div class="panel"><div class="panel-title"><span>Project Register</span>${registerAuthorityFilter()}</div>${projectTable(registerProjects)}</div>`;
  bindRegisterFilters();
}

function renderProject(code) {
  const project = state.projects.find((p) => p.code === code) || state.projects[0];
  if (!project) {
    appView.innerHTML = `<div class="empty-state">No projects found.</div>`;
    return;
  }
  ensureProjectLists(project);
  viewEyebrow.textContent = project.code;
  viewTitle.textContent = project.name;
  appView.innerHTML = `
    <div class="project-header">
      <div class="panel project-details-panel">
        <div class="panel-title">Project Details</div>
        <div class="detail-grid">
          ${projectField(project, "code", "Project Code")}
          ${projectField(project, "name", "Project")}
          ${projectField(project, "client", "Client")}
          ${projectField(project, "location", "Location")}
          ${projectField(project, "status", "Overall Status")}
          ${projectField(project, "phase", "Current Phase")}
          ${projectField(project, "priority", "Priority")}
          ${projectField(project, "authority", "Authority")}
          ${projectField(project, "developer", "Developer")}
        </div>
      </div>
      ${checklistPanel(project, "nocs", "LIST OF NOCS", "NOC", options.nocStatuses)}
      ${checklistPanel(project, "documents", "LIST OF DOCS", "Document", options.documentStatuses)}
    </div>
    <div class="section-stack">
      ${trackerPanel(project, "design", "Design Tracker", designColumns, "blue")}
      ${trackerPanel(project, "approvals", "Authority Approvals", approvalColumns, "teal")}
      ${trackerPanel(project, "construction", "Construction Tracker", constructionColumns, "amber")}
    </div>`;
  bindProjectEditors(project);
}

function projectField(project, key, label) {
  if (key === "status") return `<label>${label}</label><div>${selectControl(options.projectStatuses, project[key], `data-project="${project.code}" data-field="${key}"`)}</div>`;
  if (key === "priority") return `<label>${label}</label><div>${selectControl(options.priorities, project[key], `data-project="${project.code}" data-field="${key}"`)}</div>`;
  if (key === "authority") return `<label>${label}</label><div>${selectControl(options.projectAuthorities, project[key], `data-project="${project.code}" data-field="${key}"`)}</div>`;
  return `<label>${label}</label><div contenteditable="true" spellcheck="false" data-project="${project.code}" data-field="${key}">${escapeHtml(project[key] ?? "")}</div>`;
}

function registerAuthorityFilter() {
  return `<label class="heading-filter">Authority ${selectControl(["All Authorities", ...options.projectAuthorities], currentRegisterAuthority || "All Authorities", "id=\"registerAuthorityFilter\" aria-label=\"Authority filter\"")}</label>`;
}

function bindRegisterFilters() {
  const filter = document.getElementById("registerAuthorityFilter");
  if (!filter) return;
  filter.addEventListener("change", () => {
    currentRegisterAuthority = filter.value === "All Authorities" ? "" : filter.value;
    render();
  });
}

function checklistPanel(project, key, title, itemLabel, statuses) {
  return `
    <div class="panel checklist-panel">
      <div class="panel-title">${title}</div>
      <div class="table-wrap compact-table-wrap">
        <table class="compact-table">
          <thead><tr><th>${itemLabel}</th><th>Status</th></tr></thead>
          <tbody>${project[key].map((row, rowIndex) => `<tr>
            <td>${escapeHtml(row[0])}</td>
            <td>${selectControl(statuses, row[1], `data-checklist="${key}" data-row="${rowIndex}"`)}</td>
          </tr>`).join("")}</tbody>
        </table>
      </div>
    </div>`;
}

function trackerPanel(project, key, title, columns, color) {
  return `
    <div class="panel">
      <div class="panel-title ${color}"><span>${title}</span><button class="heading-button" data-add-row="${key}" title="Add row">Add Row</button></div>
      <div class="table-wrap">
        <table>
          <thead><tr>${columns.map((c) => `<th>${c}</th>`).join("")}<th></th></tr></thead>
          <tbody>
            ${(project[key] || []).map((row, rowIndex) => editableRow(project.code, key, row, rowIndex, columns.length)).join("") || `<tr><td colspan="${columns.length + 1}" class="empty-state">No rows yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>`;
}

function editableRow(code, section, row, rowIndex, columnCount) {
  const locked = isLockedRow(row, columnCount);
  const cells = Array.from({ length: columnCount }, (_, colIndex) => {
    const value = row[colIndex] ?? "";
    const selectOptions = selectOptionsForCell(section, colIndex);
    if (locked) {
      const rendered = isStatusColumn(section, colIndex) ? statusPill(value) : escapeHtml(value);
      return `<td class="locked-cell ${section === "design" && colIndex === 0 ? "stage-group-cell" : ""}">${rendered}</td>`;
    }
    if (selectOptions) {
      const stageAttr = section === "design" && colIndex === 0 ? ' data-stage-group="true"' : "";
      return `<td>${selectControl(selectOptions, value, `data-project="${code}" data-section="${section}" data-row="${rowIndex}" data-col="${colIndex}"${stageAttr}`)}</td>`;
    }
    const rendered = isStatusColumn(section, colIndex) ? statusPill(value) : escapeHtml(value);
    return `<td contenteditable="true" spellcheck="false" data-project="${code}" data-section="${section}" data-row="${rowIndex}" data-col="${colIndex}">${rendered}</td>`;
  }).join("");
  const actions = locked
    ? `<button class="small-button edit" data-edit-row="${section}" data-row="${rowIndex}">Edit</button>`
    : `<div class="row-actions"><button class="symbol-button success" data-lock-row="${section}" data-row="${rowIndex}" title="Lock row" aria-label="Lock row">&check;</button><button class="symbol-button danger" data-delete-row="${section}" data-row="${rowIndex}" title="Delete row" aria-label="Delete row">&times;</button></div>`;
  return `<tr class="${locked ? "locked-row" : ""}">${cells}<td>${actions}</td></tr>`;
}

function bindProjectEditors(project) {
  appView.querySelectorAll("select[data-field]").forEach((select) => {
    select.addEventListener("change", () => {
      project[select.dataset.field] = select.value;
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-field]").forEach((cell) => {
    if (cell.tagName === "SELECT") return;
    cell.addEventListener("blur", () => {
      project[cell.dataset.field] = cell.textContent.trim();
      if (cell.dataset.field === "code") currentProject = project.code;
      saveState();
      render();
    });
  });
  appView.querySelectorAll("select[data-section]").forEach((select) => {
    select.addEventListener("change", () => {
      const row = Number(select.dataset.row);
      const col = Number(select.dataset.col);
      project[select.dataset.section][row][col] = select.value;
      saveState();
      render();
    });
  });
  appView.querySelectorAll("select[data-checklist]").forEach((select) => {
    select.addEventListener("change", () => {
      project[select.dataset.checklist][Number(select.dataset.row)][1] = select.value;
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-section]").forEach((cell) => {
    if (cell.tagName === "SELECT") return;
    cell.addEventListener("focus", () => {
      cell.textContent = cell.textContent.trim();
    });
    cell.addEventListener("blur", () => {
      const row = Number(cell.dataset.row);
      const col = Number(cell.dataset.col);
      project[cell.dataset.section][row][col] = cell.textContent.trim();
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-add-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.addRow;
      const columns = section === "design" ? designColumns : section === "approvals" ? approvalColumns : constructionColumns;
      project[section].push(Array(columns.length).fill(""));
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-delete-row]").forEach((button) => {
    button.addEventListener("click", () => {
      project[button.dataset.deleteRow].splice(Number(button.dataset.row), 1);
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-lock-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.lockRow;
      const rowIndex = Number(button.dataset.row);
      const columns = section === "design" ? designColumns : section === "approvals" ? approvalColumns : constructionColumns;
      const row = project[section].splice(rowIndex, 1)[0];
      row[columns.length] = "__locked";
      project[section].push(row);
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-edit-row]").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.dataset.editRow;
      const rowIndex = Number(button.dataset.row);
      const columns = section === "design" ? designColumns : section === "approvals" ? approvalColumns : constructionColumns;
      project[section][rowIndex][columns.length] = "";
      saveState();
      render();
    });
  });
}

function projectTable(projects) {
  return `<div class="table-wrap"><table>
    <thead><tr>${["Project Code", "Project", "Client", "Location", "Overall Status", "Current Phase", "Priority", "Developer", "LPO Date", "Target Completion", "% Complete", "Authority"].map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${projects.map((p) => `<tr>
      <td>${escapeHtml(p.code)}</td><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.client)}</td><td>${escapeHtml(p.location)}</td>
      <td>${statusPill(p.status)}</td><td>${escapeHtml(p.phase)}</td><td>${escapeHtml(p.priority)}</td><td>${escapeHtml(p.developer)}</td>
      <td>${escapeHtml(p.lpo)}</td><td>${escapeHtml(p.target)}</td><td>${Number(p.complete) || 0}%</td><td>${escapeHtml(p.authority)}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

function dailyTasksPanel() {
  return `
    <div class="panel daily-panel">
      <div class="panel-title purple"><span>Daily Tasks</span><button class="heading-button" id="addDailyTaskBtn" title="Add daily task">Add Task</button></div>
      <div class="table-wrap">
        <table class="daily-table">
          <thead><tr>${dailyTaskColumns.map((h) => `<th>${h}</th>`).join("")}<th>Actions</th></tr></thead>
          <tbody>${state.dailyTasks.map(dailyTaskRow).join("") || `<tr><td colspan="8" class="empty-row">No active daily tasks.</td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
}

function dailyTaskRow(row, rowIndex) {
  const cells = dailyTaskColumns.map((column, colIndex) => {
    const value = row[colIndex] || "";
    const selectValues = dailyTaskOptions(colIndex);
    if (selectValues) {
      return `<td>${selectControl(selectValues, value, `data-daily-row="${rowIndex}" data-daily-col="${colIndex}"`)}</td>`;
    }
    const rendered = colIndex === 6 ? statusPill(value) : escapeHtml(value);
    return `<td contenteditable="true" spellcheck="false" data-daily-row="${rowIndex}" data-daily-col="${colIndex}">${rendered}</td>`;
  }).join("");
  return `<tr>${cells}<td><div class="row-actions"><button class="small-button success" data-complete-daily="${rowIndex}">Completed</button><button class="small-button danger" data-delete-daily="${rowIndex}">Delete</button></div></td></tr>`;
}

function dailyTaskOptions(colIndex) {
  if (colIndex === 2) return sortedProjects(state.projects).map((project) => project.code);
  if (colIndex === 3) return options.dailyFor;
  if (colIndex === 4) return options.priorities;
  if (colIndex === 6) return options.dailyStatuses;
  return null;
}

function bindDailyTasks() {
  const addButton = document.getElementById("addDailyTaskBtn");
  if (addButton) {
    addButton.addEventListener("click", () => {
      state.dailyTasks.unshift(["", "", currentProject || state.projects[0]?.code || "", "Client", "Medium", "", "In Progress", ""]);
      saveState();
      render();
    });
  }
  appView.querySelectorAll("select[data-daily-row]").forEach((select) => {
    select.addEventListener("change", () => {
      const row = Number(select.dataset.dailyRow);
      const col = Number(select.dataset.dailyCol);
      state.dailyTasks[row][col] = select.value;
      if (col === 6) state.dailyTasks[row][7] = select.value === "Done" ? todayKey() : "";
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-daily-row]").forEach((cell) => {
    if (cell.tagName === "SELECT") return;
    cell.addEventListener("focus", () => {
      cell.textContent = cell.textContent.trim();
    });
    cell.addEventListener("blur", () => {
      const row = Number(cell.dataset.dailyRow);
      const col = Number(cell.dataset.dailyCol);
      state.dailyTasks[row][col] = cell.textContent.trim();
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-delete-daily]").forEach((button) => {
    button.addEventListener("click", () => {
      state.dailyTasks.splice(Number(button.dataset.deleteDaily), 1);
      saveState();
      render();
    });
  });
  appView.querySelectorAll("[data-complete-daily]").forEach((button) => {
    button.addEventListener("click", () => {
      completeDailyTask(Number(button.dataset.completeDaily));
      saveState();
      render();
    });
  });
}

function overallProjectFilter(projects) {
  const values = ["All Projects", ...projects.map((project) => project.code)];
  return `<label class="heading-filter">${selectControl(values, currentOverallProject || "All Projects", "id=\"overallProjectFilter\" aria-label=\"Project filter\"")}</label>`;
}

function bindOverallFilters() {
  const filter = document.getElementById("overallProjectFilter");
  if (!filter) return;
  filter.addEventListener("change", () => {
    currentOverallProject = filter.value === "All Projects" ? "" : filter.value;
    render();
  });
}

function completeDailyTask(rowIndex) {
  const task = state.dailyTasks[rowIndex];
  if (!task) return;
  const completed = [...task];
  completed[6] = "Completed";
  completed[7] = todayKey();
  state.completedDailyTasks.unshift(completed);
  state.dailyTasks.splice(rowIndex, 1);
}

function statusSummaryTable(rows, statuses) {
  return `<div class="table-wrap"><table>
    <thead><tr><th>Status</th><th>Count</th><th>High Priority</th></tr></thead>
    <tbody>${statuses.map((status) => `<tr><td>${statusPill(status)}</td><td>${rows.filter((r) => r.status === status).length}</td><td>${rows.filter((r) => r.status === status && r.priority === "High").length}</td></tr>`).join("")}</tbody>
  </table></div>`;
}

function overallRow(row) {
  return `<tr>
    <td>${escapeHtml(row.code)}</td><td>${escapeHtml(row.project)}</td><td>${escapeHtml(row.type)}</td><td>${escapeHtml(row.stage)}</td><td>${escapeHtml(row.milestone)}</td>
    <td>${escapeHtml(row.owner)}</td><td>${escapeHtml(row.start)}</td><td>${escapeHtml(row.target)}</td><td>${escapeHtml(row.actual)}</td>
    <td>${statusPill(row.status)}</td><td>${escapeHtml(row.priority)}</td><td>${escapeHtml(row.comment)}</td><td>${escapeHtml(row.next)}</td>
  </tr>`;
}

function flattenTracker(projects) {
  const projectCodes = new Set(projects.map((project) => project.code));
  const projectNames = new Map(projects.map((project) => [project.code, project.name]));
  const trackerRows = projects.flatMap((project) => [
    ...project.design.filter(hasData).map((row) => ({
      code: project.code, project: project.name, type: "Design", stage: row[0], milestone: row[1], owner: row[3],
      start: row[4], target: row[6], actual: row[8] || row[7], complete: "", status: row[9], priority: project.priority, comment: row[10], next: "",
    })),
    ...project.approvals.filter(hasData).map((row) => ({
      code: project.code, project: project.name, type: "Approval", stage: row[0], milestone: row[1], owner: row[8],
      start: row[2], target: row[4], actual: row[5], complete: "", status: row[6], priority: row[7], comment: row[9], next: row[10],
    })),
    ...project.construction.filter(hasData).map((row) => ({
      code: project.code, project: project.name, type: "Construction", stage: row[0], milestone: row[1], owner: row[1],
      start: row[2], target: row[3], actual: row[5], complete: `${row[6] || 0}%`, status: row[7], priority: row[8], comment: row[9], next: row[10],
    })),
  ]);
  const completedDailyRows = (state.completedDailyTasks || []).filter((row) => projectCodes.has(row[2])).map((row) => ({
    code: row[2],
    project: projectNames.get(row[2]) || "",
    type: "Daily Task",
    stage: row[3],
    milestone: row[0],
    owner: row[5],
    start: row[7] || "",
    target: "",
    actual: row[7] || "",
    complete: "100%",
    status: "Completed",
    priority: row[4],
    comment: row[1],
    next: "Completed from Daily Tasks",
  }));
  return [...completedDailyRows, ...trackerRows];
}

function hasData(row) {
  return row.some((cell) => String(cell || "").trim());
}

function isStatusColumn(section, colIndex) {
  return (section === "design" && colIndex === 9) || (section === "approvals" && colIndex === 6) || (section === "construction" && colIndex === 7);
}

function isLockedRow(row, columnCount) {
  return row[columnCount] === "__locked";
}

function selectOptionsForCell(section, colIndex) {
  if (section === "design" && colIndex === 0) return options.designStages;
  if (section === "design" && colIndex === 2) return options.disciplines;
  if (section === "design" && colIndex === 9) return options.designStatuses;
  if (section === "approvals" && colIndex === 0) return options.authorities;
  if (section === "approvals" && colIndex === 6) return options.approvalStatuses;
  if (section === "approvals" && colIndex === 7) return options.priorities;
  if (section === "construction" && colIndex === 7) return options.constructionStatuses;
  if (section === "construction" && colIndex === 8) return options.priorities;
  return null;
}

function selectControl(values, value, attrs) {
  const current = String(value || "");
  const allValues = current && !values.includes(current) ? [current, ...values] : values;
  const statusClass = statusSelectClass(values, current);
  const stageClass = attrs.includes("data-stage-group") ? " stage-select" : "";
  return `<select class="cell-select${statusClass}${stageClass}" ${attrs}>
    ${allValues.map((option) => `<option value="${escapeHtml(option)}" ${option === current ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
  </select>`;
}

function statusSelectClass(values, current) {
  const statusValues = new Set([...options.designStatuses, ...options.approvalStatuses, ...options.constructionStatuses, ...options.dailyStatuses, ...options.projectStatuses, ...options.nocStatuses, ...options.documentStatuses]);
  const statusClass = values.some((value) => statusValues.has(value)) ? ` status-select status-${statusClassName(current || values[0])}` : "";
  return `${statusClass}`;
}

function statusPill(status) {
  const value = String(status || "Not Started");
  const klass = statusClassName(value);
  return `<span class="status-pill status-${klass}">${escapeHtml(value)}</span>`;
}

function statusClassName(value) {
  return String(value || "Not Started").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function cleanupDailyTasks(sourceState) {
  const today = todayKey();
  sourceState.dailyTasks = normalizeDailyRows(sourceState.dailyTasks || []).filter((row) => row[6] !== "Done" || !row[7] || row[7] >= today);
  sourceState.completedDailyTasks = normalizeDailyRows(sourceState.completedDailyTasks || []);
  return sourceState;
}

function normalizeState(sourceState) {
  sourceState.projects = (sourceState.projects || []).map((project) => {
    ensureProjectLists(project);
    return project;
  }).sort(compareProjectsByCode);
  return sourceState;
}

function ensureProjectLists(project) {
  if (project.authority == null) project.authority = project.approvals?.[0]?.[0] || "";
  if (!options.projectAuthorities.includes(project.authority)) project.authority = project.approvals?.find((row) => options.projectAuthorities.includes(row[0]))?.[0] || "Dubai Municipality";
  if (project.developer == null) project.developer = "";
  project.nocs = mergeChecklist(project.nocs, nocItems, "Not Applicable");
  project.documents = mergeChecklist(project.documents, documentItems, "Pending");
  return project;
}

function mergeChecklist(existingRows, itemNames, defaultStatus) {
  const existing = new Map((existingRows || []).map((row) => [row[0], row[1] || defaultStatus]));
  return itemNames.map((item) => [item, existing.get(item) || defaultStatus]);
}

function normalizeDailyRows(rows) {
  return rows.map((row) => {
    const normalized = [...row];
    if (normalized[3] === "Authorities") normalized[3] = "Dubai Municipality";
    return normalized;
  });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function avg(values) {
  const valid = values.filter((v) => Number.isFinite(v));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function addProject() {
  const next = String(state.projects.length + 5).padStart(3, "0");
  const project = {
    code: `AS${next}`,
    name: "New Project",
    client: "",
    location: "",
    status: "Active",
    phase: "Preliminary Design",
    priority: "Medium",
    lead: "",
    authority: "",
    developer: "",
    lpo: "",
    target: "",
    complete: 0,
    notes: "",
    design: [],
    approvals: [],
    construction: [],
    nocs: mergeChecklist([], nocItems, "Not Applicable"),
    documents: mergeChecklist([], documentItems, "Pending"),
  };
  state.projects.push(project);
  state.projects.sort(compareProjectsByCode);
  currentProject = project.code;
  currentView = "project";
  saveState();
  render();
}

function deleteProject() {
  const project = state.projects.find((item) => item.code === currentProject) || sortedProjects(state.projects)[0];
  if (!project) {
    alert("No project available to delete.");
    return;
  }
  if (!confirm(`Delete project ${project.code} - ${project.name}? This will also remove related daily task entries.`)) return;
  state.projects = state.projects.filter((item) => item !== project).sort(compareProjectsByCode);
  state.dailyTasks = (state.dailyTasks || []).filter((row) => row[2] !== project.code);
  state.completedDailyTasks = (state.completedDailyTasks || []).filter((row) => row[2] !== project.code);
  currentProject = sortedProjects(state.projects)[0]?.code || "";
  currentOverallProject = currentOverallProject === project.code ? "" : currentOverallProject;
  currentRegisterAuthority = "";
  if (!state.projects.length) currentView = "dashboard";
  saveState();
  render();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "project-tracker-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.projects)) throw new Error("Missing projects array");
      if (!Array.isArray(imported.dailyTasks)) imported.dailyTasks = [];
      if (!Array.isArray(imported.completedDailyTasks)) imported.completedDailyTasks = [];
      state = normalizeState(cleanupDailyTasks(imported));
      currentProject = state.projects[0]?.code || "";
      currentOverallProject = "";
      saveState();
      render();
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm("Reset tracker to sample data?")) return;
  state = normalizeState({ projects: structuredClone(seedProjects), dailyTasks: structuredClone(seedDailyTasks), completedDailyTasks: [] });
  currentProject = state.projects[0]?.code || "";
  currentOverallProject = "";
  currentView = "dashboard";
  saveState();
  render();
}
