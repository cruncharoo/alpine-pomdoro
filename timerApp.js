class TimerApp extends HTMLElement {
  constructor() {
    super();
    this.time = 15;
    this.minutes = 25;
    this.seconds = 0;
    this.timer_running = false;
    this.mode = "Working";
    this.timer = null;
    this.backgroundColor = "green";

    const template = document.createElement("template");
    template.innerHTML = `
    <div id="timerApp" style="display:inline-block; padding: 20px">
        <div>
        Mode: <span id="displayMode"></span>
        </div>
        <div style="padding-bottom: 5px">
            Timer: <span id="displayTime"></span>
        </div>
        <div class="buttons">
            <button id="startTimer">Start</button>
            <button id="stopTimer">Pause</button>
            <button id="resetTimer">Reset</button>
        </div>
        </div>
    </div>
    `;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.startButton = this.shadowRoot.getElementById("startTimer");
    this.stopButton = this.shadowRoot.getElementById("stopTimer");
    this.resetButton = this.shadowRoot.getElementById("resetTimer");

    this.startButton.addEventListener("click", this.startTimer.bind(this));
    this.stopButton.addEventListener("click", this.stopTimer.bind(this));
    this.resetButton.addEventListener("click", this.resetTimer.bind(this));
  }

  startTimer() {
    if (!this.timer_running) {
      this.timer = setInterval(() => {
        this.time--;
        this.minutes = Math.floor(this.time / 60);
        this.seconds = this.time % 60;
        this.timer_running = true;
        this.updateTime();
        if (this.time <= 0) {
          this.stopTimer();
          this.seconds = 0;
          if (this.mode === "Working") {
            this.mode = "Break";
            this.updateMode();
            this.backgroundColor = "red";
            this.updateColor();
            this.time = 15;
            this.minutes = 5;
          } else {
            this.resetTimer();
          }
          this.startTimer();
        }
      }, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer_running = false;
  }

  resetTimer() {
    this.stopTimer();
    this.time = 15;
    this.minutes = 25;
    this.seconds = 0;
    this.updateTime();
    this.mode = "Working";
    this.updateMode();
    this.backgroundColor = "green";
    this.updateColor();
  }

  updateTime() {
    const span = this.shadowRoot.getElementById("displayTime");
    span.textContent = `${this.minutes
      .toString()
      .padStart(2, "0")}:${this.seconds.toString().padStart(2, "0")}`;
  }

  updateColor() {
    const timerSpan = this.shadowRoot.getElementById("timerApp");
    timerSpan.style.backgroundColor = this.backgroundColor;
  }

  updateMode() {
    const modeSpan = this.shadowRoot.getElementById("displayMode");
    modeSpan.textContent = this.mode;
  }

  connectedCallback() {
    this.resetTimer();
  }
}

customElements.define("timer-app", TimerApp);
