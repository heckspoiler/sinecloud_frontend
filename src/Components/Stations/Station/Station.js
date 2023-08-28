import React from "react";
import "./Station.css";
import instagram from "./Logos/web/instagram.svg";
import soundcloud from "./Logos/web/soundcloud.svg";

export const Station = (props) => {
  return (
    <div className="stations_radio-station">
      <img
        src={props.logo}
        className="stations_radio-image"
        alt={props.name}
      ></img>

      <section className="stations_logo-container">
        <a
          href={props.url}
          className="stations_img-anchor"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={props.logo}
            alt="globe-logo-web"
            className="stations_social-svg social-svg-web"
          />
        </a>
        <a href={props.instagram} target="_blank" rel="noreferrer">
          <img
            src={instagram}
            alt="globe-logo-web"
            className="stations_social-svg social-svg-instagram"
          ></img>
        </a>
        <a href={props.soundcloud} target="_blank" rel="noreferrer">
          <img
            src={soundcloud}
            alt="globe-logo-web"
            className="stations_social-svg social-svg-soundcloud"
          ></img>
        </a>
      </section>
    </div>
  );
};
