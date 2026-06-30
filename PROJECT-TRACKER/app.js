const storageKey = "design-consultancy-project-tracker-v4";

const options = {
  designStages: ["PRELIMINARY", "FINAL"],
  disciplines: ["Architecture", "STRUCTURE", "ELECTRICAL", "Mechanical", "Plumbing", "DCD"],
  authorities: ["Dubai Municipality", "DDA", "Dubai South", "Trakhees", "Emaar", "Nakheel", "Master Developer", "DEWA - ELE", "DEWA - Water", "DCD"],
  projectStatuses: ["Active", "On Hold", "Completed", "Cancelled"],
  priorities: ["High", "Medium", "Low"],
  designStatuses: ["Not Started", "In Progress", "On Track", "At Risk", "Delayed", "Completed", "Minor Comments"],
  approvalStatuses: ["Not Started", "Submitted", "In Progress", "Minor Comments", "Rejected", "Approved", "Delayed"],
  constructionStatuses: ["Not Started", "Mobilized", "In Progress", "On Track", "At Risk", "Delayed", "Completed"],
};

const seedProjects = [
  {
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
  },
  {
    code: "AS006",
    name: "Private Villa Renovation",
    client: "Al Noor Holdings",
    location: "Jumeirah",
    status: "Active",
    phase: "Preliminary Design",
    priority: "Medium",
    lead: "Sara",
    lpo: "2026-02-15",
    target: "2026-09-15",
    complete: 32,
    notes: "Client review meeting pending.",
    design: [
      ["PRELIMINARY", "Concept options", "Architecture", "Sara", "2026-02-15", "21", "2026-03-07", "2026-03-09", "", "Minor Comments", "Client requested facade alternate."],
      ["PRELIMINARY", "Client preliminary approval", "Architecture", "Sara", "2026-03-10", "14", "2026-03-24", "", "", "In Progress", "Meeting to close comments."],
    ],
    approvals: [],
    construction: [],
  },
  {
    code: "AS007",
    name: "Boutique Retail Fit-out",
    client: "Nexa Retail",
    location: "Dubai Hills",
    status: "Active",
    phase: "Authority Approvals",
    priority: "High",
    lead: "Hassan",
    lpo: "2026-01-10",
    target: "2026-08-20",
    complete: 64,
    notes: "DCD final approval under review.",
    design: [["FINAL", "IFC package coordination", "Mechanical", "Hassan", "2026-04-01", "35", "2026-05-06", "2026-05-15", "", "Delayed", "MEP builder information arrived late."]],
    approvals: [["Dubai Municipality", "Final Approval", "2026-05-28", "2026-06-12", "2026-07-05", "", "In Progress", "High", "Hassan", "Resubmitted after smoke extract comment.", "Follow up reviewer."]],
    construction: [["Fit-out Mobilization", "Prime Fitout", "2026-07-10", "2026-07-20", "", "", "0", "Not Started", "High", "Permit under review.", "Confirm mobilization date."]],
  },
  {
    code: "AS008",
    name: "Warehouse Extension",
    client: "BlueLine Logistics",
    location: "Dubai South",
    status: "Active",
    phase: "Construction",
    priority: "Medium",
    lead: "Mina",
    lpo: "2025-11-20",
    target: "2026-10-10",
    complete: 71,
    notes: "Site progress generally on track.",
    design: [["FINAL", "Tender clarifications", "Architecture", "Mina", "2026-04-08", "10", "2026-04-18", "2026-04-17", "2026-04-20", "Completed", ""]],
    approvals: [["Dubai South", "Final Design Submission", "2025-12-18", "2026-01-27", "2026-03-25", "2026-03-25", "Approved", "Medium", "Mina", "Architectural and structural approvals received.", "Close authority tracker."]],
    construction: [
      ["Substructure", "BlueLine Contractor", "2026-04-28", "2026-06-15", "2026-04-29", "", "88", "On Track", "Medium", "", "Close waterproofing inspection."],
      ["Superstructure", "BlueLine Contractor", "2026-06-16", "2026-08-20", "", "", "12", "In Progress", "Medium", "Steel delivery to be monitored.", "Confirm delivery schedule."],
    ],
  },
  {
    code: "AS009",
    name: "G+4 Residential Building",
    client: "Al Safa Properties",
    location: "Nad Al Sheba",
    status: "Active",
    phase: "Final Design",
    priority: "High",
    lead: "Arjun",
    lpo: "2026-03-01",
    target: "2027-01-15",
    complete: 41,
    notes: "Structural coordination risk.",
    design: [["FINAL", "Structural coordination freeze", "STRUCTURE", "Arjun", "2026-05-05", "20", "2026-05-25", "", "", "At Risk", "Column grid change impacts MEP risers."]],
    approvals: [["Dubai Municipality", "Structural Comments-01", "2026-02-19", "2026-02-19", "2026-03-15", "", "Minor Comments", "High", "Arjun", "Structural comment round open.", "Coordinate response."]],
    construction: [["Enabling Works", "TBC", "2026-09-01", "2026-10-01", "", "", "0", "Not Started", "High", "Design freeze pending.", "Finalize tender documents."]],
  },
  {
    code: "AS010",
    name: "Hospitality Concept Upgrade",
    client: "Vista Hospitality",
    location: "Business Bay",
    status: "On Hold",
    phase: "Preliminary Design",
    priority: "Low",
    lead: "Sara",
    lpo: "2026-04-05",
    target: "2026-12-15",
    complete: 18,
    notes: "Awaiting revised operator brief.",
    design: [],
    approvals: [],
    construction: [],
  },
  {
    code: "AS011",
    name: "Community Majlis",
    client: "Meraas Community",
    location: "Al Khawaneej",
    status: "Active",
    phase: "Authority Approvals",
    priority: "Medium",
    lead: "Hassan",
    lpo: "2026-05-02",
    target: "2026-11-30",
    complete: 36,
    notes: "DEWA load clarification required.",
    design: [["PRELIMINARY", "Preliminary authority package", "Architecture", "Hassan", "2026-05-20", "18", "2026-06-07", "2026-06-10", "", "Minor Comments", "Drawing stamp update requested."]],
    approvals: [["DDA", "Load NOC", "2026-06-14", "", "2026-07-08", "", "In Progress", "Medium", "Hassan", "Load clarification required.", "Issue revised load letter."]],
    construction: [],
  },
  {
    code: "AS012",
    name: "Villa Landscape Package",
    client: "Private Client",
    location: "Emirates Hills",
    status: "Completed",
    phase: "Handover",
    priority: "Low",
    lead: "Mina",
    lpo: "2025-09-15",
    target: "2026-04-28",
    complete: 100,
    notes: "Closed.",
    design: [],
    approvals: [],
    construction: [["Handover / Snag Closure", "Landscape Works LLC", "2026-04-01", "2026-04-28", "2026-04-01", "2026-04-28", "100", "Completed", "Low", "", "Archive completion records."]],
  },
];

const designColumns = ["Stage Group", "Stage Description", "Discipline", "Owner", "Planned Start", "Duration Days", "ETS", "Submission Date", "Actual Approval", "Status", "Delay Reason / Action"];
const approvalColumns = ["Authority", "Application / Milestone", "Submission Date", "Resubmission Date", "Target Approval", "Actual Approval", "Status", "Priority", "Owner", "Dependency / Comment", "Next Action"];
const constructionColumns = ["Construction Stage", "Contractor / Party", "Planned Start", "Planned Finish", "Actual Start", "Actual Finish", "% Complete", "Status", "Priority", "Blocker / Delay Reason", "Next Site Action"];

let state = loadState();
let currentView = "dashboard";
let currentProject = state.projects[0]?.code || "";

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
document.getElementById("exportBtn").addEventListener("click", exportData);
document.getElementById("importFile").addEventListener("change", importData);
document.getElementById("resetBtn").addEventListener("click", resetData);
searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);

render();

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return { projects: structuredClone(seedProjects) };
  try {
    const parsed = JSON.parse(saved);
    return parsed.projects ? parsed : { projects: structuredClone(seedProjects) };
  } catch {
    return { projects: structuredClone(seedProjects) };
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
  return state.projects.filter((project) => {
    const haystack = [project.code, project.name, project.client, project.location, project.status, project.phase, project.lead].join(" ").toLowerCase();
    return (!q || haystack.includes(q)) && (!status || project.status === status);
  });
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
  const rows = flattenTracker(filteredProjects());
  appView.innerHTML = `
    <div class="panel">
      <div class="panel-title">Combined Tracker</div>
      <div class="table-wrap">
        <table>
          <thead><tr>${["Project Code", "Project", "Type", "Stage / Authority", "Milestone", "Owner / Party", "Start / Submission", "Target", "Actual", "% Complete", "Status", "Priority", "Comment", "Next Action"].map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.map(overallRow).join("")}</tbody>
        </table>
      </div>
    </div>`;
}

function renderProjectIndex() {
  viewEyebrow.textContent = "Register";
  viewTitle.textContent = "Overall Projects";
  appView.innerHTML = `<div class="panel"><div class="panel-title">Project Register</div>${projectTable(filteredProjects())}</div>`;
}

function renderProject(code) {
  const project = state.projects.find((p) => p.code === code) || state.projects[0];
  if (!project) {
    appView.innerHTML = `<div class="empty-state">No projects found.</div>`;
    return;
  }
  viewEyebrow.textContent = project.code;
  viewTitle.textContent = project.name;
  appView.innerHTML = `
    <div class="project-header">
      <div class="panel">
        <div class="panel-title">Project Details</div>
        <div class="detail-grid">
          ${projectField(project, "code", "Project Code")}
          ${projectField(project, "name", "Project")}
          ${projectField(project, "client", "Client")}
          ${projectField(project, "location", "Location")}
          ${projectField(project, "status", "Overall Status")}
          ${projectField(project, "phase", "Current Phase")}
          ${projectField(project, "priority", "Priority")}
          ${projectField(project, "lead", "Project Lead")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">Schedule Summary</div>
        <div class="detail-grid">
          ${projectField(project, "lpo", "LPO Date")}
          ${projectField(project, "target", "Target Completion")}
          ${projectField(project, "complete", "% Complete")}
          ${projectField(project, "notes", "Management Notes")}
        </div>
      </div>
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
  return `<label>${label}</label><div contenteditable="true" spellcheck="false" data-project="${project.code}" data-field="${key}">${escapeHtml(project[key] ?? "")}</div>`;
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
  const cells = Array.from({ length: columnCount }, (_, colIndex) => {
    const value = row[colIndex] ?? "";
    const selectOptions = selectOptionsForCell(section, colIndex);
    if (selectOptions) {
      return `<td>${selectControl(selectOptions, value, `data-project="${code}" data-section="${section}" data-row="${rowIndex}" data-col="${colIndex}"`)}</td>`;
    }
    const rendered = isStatusColumn(section, colIndex) ? statusPill(value) : escapeHtml(value);
    return `<td contenteditable="true" spellcheck="false" data-project="${code}" data-section="${section}" data-row="${rowIndex}" data-col="${colIndex}">${rendered}</td>`;
  }).join("");
  return `<tr>${cells}<td><button class="small-button" data-delete-row="${section}" data-row="${rowIndex}">Delete</button></td></tr>`;
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
}

function projectTable(projects) {
  return `<div class="table-wrap"><table>
    <thead><tr>${["Project Code", "Project", "Client", "Location", "Overall Status", "Current Phase", "Priority", "Project Lead", "LPO Date", "Target Completion", "% Complete", "Management Notes"].map((h) => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${projects.map((p) => `<tr>
      <td>${escapeHtml(p.code)}</td><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.client)}</td><td>${escapeHtml(p.location)}</td>
      <td>${statusPill(p.status)}</td><td>${escapeHtml(p.phase)}</td><td>${escapeHtml(p.priority)}</td><td>${escapeHtml(p.lead)}</td>
      <td>${escapeHtml(p.lpo)}</td><td>${escapeHtml(p.target)}</td><td>${Number(p.complete) || 0}%</td><td>${escapeHtml(p.notes)}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
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
    <td>${escapeHtml(row.owner)}</td><td>${escapeHtml(row.start)}</td><td>${escapeHtml(row.target)}</td><td>${escapeHtml(row.actual)}</td><td>${escapeHtml(row.complete)}</td>
    <td>${statusPill(row.status)}</td><td>${escapeHtml(row.priority)}</td><td>${escapeHtml(row.comment)}</td><td>${escapeHtml(row.next)}</td>
  </tr>`;
}

function flattenTracker(projects) {
  return projects.flatMap((project) => [
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
}

function hasData(row) {
  return row.some((cell) => String(cell || "").trim());
}

function isStatusColumn(section, colIndex) {
  return (section === "design" && colIndex === 9) || (section === "approvals" && colIndex === 6) || (section === "construction" && colIndex === 7);
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
  return `<select class="cell-select" ${attrs}>
    <option value=""></option>
    ${allValues.map((option) => `<option value="${escapeHtml(option)}" ${option === current ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
  </select>`;
}

function statusPill(status) {
  const value = String(status || "Not Started");
  const klass = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `<span class="status-pill status-${klass}">${escapeHtml(value)}</span>`;
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
    lpo: "",
    target: "",
    complete: 0,
    notes: "",
    design: [],
    approvals: [],
    construction: [],
  };
  state.projects.push(project);
  currentProject = project.code;
  currentView = "project";
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
      state = imported;
      currentProject = state.projects[0]?.code || "";
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
  state = { projects: structuredClone(seedProjects) };
  currentProject = state.projects[0]?.code || "";
  currentView = "dashboard";
  saveState();
  render();
}
