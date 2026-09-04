/* =========================================================================
   FLOW 3 — NCAA.com right-rail widget + "Build Your Matchup" modal
   =========================================================================
   Fully self-contained: does not read/write the sessionStorage key used by
   js/app.js ('mml_matchup_entry') and is only ever loaded on flow3.html and
   matchup-analysis-ncaa.html, so Flow 1 / Flow 2 state and behavior are
   completely unaffected.
   ========================================================================= */

(function () {
  "use strict";

  // ---- Team data (Division I) ------------------------------------------
  // California Baptist and Abilene Christian are included in the men's
  // list because they are the demonstrated path (Flow 3 Step 3 / Step 4).

  var MENS_TEAMS = [
    "Abilene Christian", "Alabama", "Arizona", "Auburn", "Baylor",
    "California Baptist", "Creighton", "Duke", "Florida", "Gonzaga",
    "Houston", "Illinois", "Iowa State", "Kansas", "Kentucky",
    "Marquette", "Michigan State", "Purdue", "San Diego State",
    "Tennessee", "Texas Tech", "UCLA", "UConn", "Wisconsin"
  ];

  var WOMENS_TEAMS = [
    "Baylor", "Colorado", "Duke", "Indiana", "Iowa",
    "Kansas State", "LSU", "Louisville", "Maryland", "Michigan",
    "North Carolina State", "Notre Dame", "Ohio State", "Oklahoma",
    "South Carolina", "Southern California", "Stanford", "TCU",
    "Texas", "UCLA", "UConn", "Utah", "Virginia Tech"
  ];

  // ---- State --------------------------------------------------------------

  var state = {
    category: "mens", // 'mens' | 'womens'
    team1: null,
    team2: null,
    openField: null // 'team1' | 'team2' | null
  };

  // ---- Element refs (populated on init) -----------------------------------

  var els = {};

  function q(id) { return document.getElementById(id); }

  function teamsForCategory() {
    return state.category === "womens" ? WOMENS_TEAMS : MENS_TEAMS;
  }

  // ---- Rendering ------------------------------------------------------------

  function renderToggle() {
    els.toggleMens.classList.toggle("bym-toggle__option--active", state.category === "mens");
    els.toggleWomens.classList.toggle("bym-toggle__option--active", state.category === "womens");
    els.toggleMens.setAttribute("aria-pressed", state.category === "mens");
    els.toggleWomens.setAttribute("aria-pressed", state.category === "womens");
  }

  function renderSelectButton(field) {
    var btn = field === "team1" ? els.team1Btn : els.team2Btn;
    var valueEl = btn.querySelector(".bym-select__value");
    var selected = state[field];
    if (selected) {
      valueEl.textContent = selected;
      valueEl.classList.add("bym-select__value--filled");
    } else {
      valueEl.textContent = "Select a team";
      valueEl.classList.remove("bym-select__value--filled");
    }
  }

  function renderOptionList(field, searchTerm) {
    var listEl = field === "team1" ? els.team1List : els.team2List;
    var otherSelected = field === "team1" ? state.team2 : state.team1;
    var mySelected = state[field];
    var term = (searchTerm || "").trim().toLowerCase();

    var teams = teamsForCategory().filter(function (t) {
      return !term || t.toLowerCase().indexOf(term) !== -1;
    });

    listEl.innerHTML = "";

    if (teams.length === 0) {
      var empty = document.createElement("div");
      empty.className = "bym-option__empty";
      empty.textContent = "No teams match your search.";
      listEl.appendChild(empty);
      return;
    }

    teams.forEach(function (team) {
      var isDisabled = team === otherSelected;
      var isSelected = team === mySelected;

      var row = document.createElement("button");
      row.type = "button";
      row.className = "bym-option" + (isSelected ? " is-selected" : "") + (isDisabled ? " is-disabled" : "");
      row.disabled = isDisabled;
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", isSelected ? "true" : "false");

      var radio = document.createElement("span");
      radio.className = "bym-option__radio";
      row.appendChild(radio);

      var label = document.createElement("span");
      label.textContent = team;
      row.appendChild(label);

      if (!isDisabled) {
        row.addEventListener("click", function () {
          selectTeam(field, team);
        });
      }

      listEl.appendChild(row);
    });
  }

  function renderCalculate() {
    var valid = !!(state.team1 && state.team2 && state.team1 !== state.team2);
    els.calculateBtn.disabled = !valid;
  }

  function renderAll() {
    renderToggle();
    renderSelectButton("team1");
    renderSelectButton("team2");
    renderOptionList("team1", els.team1Search ? els.team1Search.value : "");
    renderOptionList("team2", els.team2Search ? els.team2Search.value : "");
    renderCalculate();
  }

  // ---- Interactions ---------------------------------------------------------

  function setCategory(cat) {
    if (cat === state.category) return;
    state.category = cat;
    // Changing category clears both dropdown selections.
    state.team1 = null;
    state.team2 = null;
    closeAllFields();
    renderAll();
  }

  function selectTeam(field, team) {
    state[field] = team;
    closeAllFields();
    renderAll();
  }

  function openField(field) {
    if (state.openField === field) {
      closeAllFields();
      return;
    }
    state.openField = field;
    els.team1Field.classList.toggle("is-open", field === "team1");
    els.team2Field.classList.toggle("is-open", field === "team2");
    var searchInput = field === "team1" ? els.team1Search : els.team2Search;
    if (searchInput) {
      searchInput.value = "";
      renderOptionList(field, "");
      setTimeout(function () { searchInput.focus(); }, 0);
    }
  }

  function closeAllFields() {
    state.openField = null;
    els.team1Field.classList.remove("is-open");
    els.team2Field.classList.remove("is-open");
  }

  function resetModalState() {
    state.category = "mens";
    state.team1 = null;
    state.team2 = null;
    state.openField = null;
    if (els.team1Search) els.team1Search.value = "";
    if (els.team2Search) els.team2Search.value = "";
    closeAllFields();
    renderAll();
  }

  function openModal() {
    resetModalState();
    els.overlay.classList.add("is-open");
    els.overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    els.overlay.classList.remove("is-open");
    els.overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    closeAllFields();
  }

  function handleCalculate() {
    if (els.calculateBtn.disabled) return;
    var team1 = encodeURIComponent(state.team1);
    var team2 = encodeURIComponent(state.team2);
    var category = encodeURIComponent(state.category);
    closeModal();
    window.location.href = "matchup-analysis-ncaa.html?team1=" + team1 + "&team2=" + team2 + "&category=" + category;
  }

  // ---- Init -----------------------------------------------------------------

  function initBuildYourMatchup() {
    els.overlay = q("bym-overlay");
    els.modal = q("bym-modal");
    els.closeBtn = q("bym-close");
    els.toggleMens = q("bym-toggle-mens");
    els.toggleWomens = q("bym-toggle-womens");
    els.team1Field = q("bym-field-team1");
    els.team2Field = q("bym-field-team2");
    els.team1Btn = q("bym-select-team1");
    els.team2Btn = q("bym-select-team2");
    els.team1List = q("bym-list-team1");
    els.team2List = q("bym-list-team2");
    els.team1Search = q("bym-search-team1");
    els.team2Search = q("bym-search-team2");
    els.calculateBtn = q("bym-calculate");

    if (!els.overlay) return; // Not on this page.

    var widget = q("mini-matchup-widget");
    var widgetCta = q("mini-matchup-cta");

    if (widget) {
      widget.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    }
    if (widgetCta) {
      widgetCta.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
      });
    }

    els.closeBtn.addEventListener("click", closeModal);
    els.overlay.addEventListener("click", function (e) {
      if (e.target === els.overlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && els.overlay.classList.contains("is-open")) closeModal();
    });

    els.toggleMens.addEventListener("click", function () { setCategory("mens"); });
    els.toggleWomens.addEventListener("click", function () { setCategory("womens"); });

    els.team1Btn.addEventListener("click", function (e) {
      e.stopPropagation();
      openField("team1");
    });
    els.team2Btn.addEventListener("click", function (e) {
      e.stopPropagation();
      openField("team2");
    });

    els.team1Search.addEventListener("input", function () { renderOptionList("team1", els.team1Search.value); });
    els.team2Search.addEventListener("input", function () { renderOptionList("team2", els.team2Search.value); });

    els.team1Field.addEventListener("click", function (e) { e.stopPropagation(); });
    els.team2Field.addEventListener("click", function (e) { e.stopPropagation(); });

    document.addEventListener("click", function () { closeAllFields(); });

    els.calculateBtn.addEventListener("click", handleCalculate);

    renderAll();
  }

  function initDestinationBackLink() {
    var backLink = q("ncaa-back-link");
    if (!backLink) return;
    backLink.href = "flow3.html";
  }

  document.addEventListener("DOMContentLoaded", function () {
    initBuildYourMatchup();
    initDestinationBackLink();
  });
})();
