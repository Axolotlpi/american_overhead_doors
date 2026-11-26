import { urlFor } from './sanityClient';

export default function AboutUs({ aboutData }) {
  const subheading = aboutData?.subheading ?? '';
  const bodyText = aboutData?.bodyText ?? '';
  const imgSrc = aboutData?.image?.asset
    ? urlFor(aboutData.image).auto('format').width(800).url()
    : null;
  const imgAlt = aboutData?.image?.alt ?? '45 Years in Business';

  return (
    <section id="about" className="about-section" aria-labelledby="about-title">
      <div className="about-layout">
        <div className="about-copy">
          <h2 id="about-title" className="about-title">Who We Are</h2>
          {subheading && <h3 className="about-subheading">{subheading}</h3>}
          {bodyText && <p className="about-body">{bodyText}</p>}
        </div>
        {imgSrc && <img className="about-image" src={imgSrc} alt={imgAlt} />}
      </div>
    </section>
  );
}
