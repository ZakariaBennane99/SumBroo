/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */

const About = () => {

    return (
        <div className='footerSections'>
            <h1 className="sectionTitle">About</h1>
            <div className="aboutContentSection">
                <div className="textContent">
                <p style={{ marginTop: '0px' }}>
                Hey 👋! I'm Zakaria Bennane, hailing from the vibrant city of Casablanca <em>(that's the Atlantic Ocean behind me)</em>. Life handed me its fair share of challenges growing up, molding me into a resilient individual. Those experiences, tough as they were, shaped my perspective and drive.
                </p>

                <p>
                Navigating the world of social media, I noticed an imbalance. Many talented creators, despite having quality content, found it hard to reach a wider audience. It struck a chord with me. Why such a disparity?
                </p>

                <p>
                During a contemplative summer, the idea for SumBroo took root. Surprisingly, there weren't platforms addressing this specific need. So, with determination <em>(and quite a few cups of coffee)</em>, I embarked on the journey to develop SumBroo amidst my other commitments. It wasn't easy, but the vision kept me going.
                </p>

                <p>
                At its core, SumBroo is about community. It's a platform where creators can share their work and grow together, transcending the numbers. My hope is for it to foster genuine connections and mutual support.
                </p>

                <p>
                Thank you for taking to learn to learn about SumBroo and my journey. I'm glad you're here.
                </p>

                <p>
                Warmly, <br/>
                Z.B.
                </p>
                </div>
                <img src="/zakBen.jpeg" alt="Zakaria Bennane" className="aboutImage" />
            </div>
        </div>
    )

};

export default About;

export async function getServerSideProps() {

  return {
    props: {
      notProtected: true
    }
  };

}
