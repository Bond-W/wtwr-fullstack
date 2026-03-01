import { useContext } from "react";
import "./ToggleSwitch.css";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";



export default function ToggleSwitch() {
  const { handleToggleSwitchChange, currentTemperatureUnit } = useContext(
    CurrentTemperatureUnitContext
  );

  return (
    <label className="toggle-switch">
      <input
        checked={currentTemperatureUnit === "C"}
        className="toggle-switch__checkbox toggle-switch__checkbox_state_hidden"
        id="switch"
        type="checkbox"
        name="toggle-switch-checkbox"
        onChange={handleToggleSwitchChange}
      />
      <span className="toggle-switch__circle"></span>
      <span
        style={{ color: currentTemperatureUnit === "F" ? "#fff" : "#7e7e7e"}}
        className= "toggle-switch__text toggle-switch__text_F"
      >
        F
      </span>
      <span
        style={{ color: currentTemperatureUnit === "C" ? "#fff" : "#7e7e7e"}}
        className="toggle-switch__text toggle-switch__text_C"
      >
        C
      </span>
    </label>
  );
}
