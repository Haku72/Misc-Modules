/**
 * Timer to calculate deltaTime since last call, because why not. timer value in milliseconds
 * TODO: split into its own package
 */
export class DeltaTimer {
  private _timeNow: number;
  private _timePast: number;
  private dt: number;
  private _isRunning: boolean;

  constructor() {
    this._timeNow = 0;
    this._timePast =  0;
    this.dt = 0;
    this._isRunning = true;
  }

  start(): void {
    this._isRunning = true;

    const update = () => {
      this._timeNow = Date.now();
      this.dt = (this._timeNow - this._timePast);

      if(this._isRunning) {
        setTimeout(() =>{
          update();
        }, 0);
      }
    };

    setTimeout(() =>{
      update();
    }, 0);
  }

  stop(): void {
    this._isRunning = false;
  }
}
