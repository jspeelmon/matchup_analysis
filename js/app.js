// Shared prototype behavior: remembers which flow launched the Matchup
// Analysis destination screen so the back link can return the user to the
// correct MML Home variant, and shows a lightweight toast to make the
// tap-through interaction obvious when demoing in a browser.

function goToMatchupAnalysis(fromFlow) {
  sessionStorage.setItem('mml_matchup_entry', fromFlow);
  window.location.href = 'matchup-analysis.html?from=' + fromFlow;
}

function initMatchupAnalysisPage() {
  const params = new URLSearchParams(window.location.search);
  const from = params.get('from') || sessionStorage.getItem('mml_matchup_entry') || 'flow1';

  const backLink = document.getElementById('back-link');
  if (backLink) {
    backLink.href = from === 'flow2' ? 'flow2.html' : 'flow1.html';
  }

  // Picks are closed on flow2 — the center divider becomes a plain
  // vertical line with no "Make Pick" label, and the pick radio buttons
  // under each team are removed since picking is no longer possible.
  if (from === 'flow2') {
    const pickDivider = document.getElementById('pick-divider');
    if (pickDivider) {
      pickDivider.innerHTML = '<div class="w-px flex-1 bg-[#c1c2ca]"></div>';
    }
    document.querySelectorAll('.pick-radio').forEach((el) => el.remove());
  }

  const toast = document.getElementById('entry-toast');
  if (toast) {
    const label = from === 'flow2'
      ? 'Opened from the Matchup Analysis widget \u2014 Picks Closed'
      : 'Opened from the Matchup Analysis widget \u2014 Picks Open';
    toast.textContent = label;
    requestAnimationFrame(() => {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2600);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page === 'matchup-analysis') {
    initMatchupAnalysisPage();
  }
});
