import About from "./about/About";
import AboutHero from "./about/AboutHero";
import Privacy from "./about/Privacy";
import Team from "./about/Team";

export default function Info() {
  return (
    <div>
      <AboutHero />
      <About />
      <Team />
      <Privacy />
    </div>
  );
}
