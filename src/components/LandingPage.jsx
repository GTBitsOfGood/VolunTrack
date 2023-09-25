import { Button } from "flowbite-react";
import BoGButton from "./BoGButton";
import { router, useRouter, withRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const goToLogin = () => {
  router.push("/login");
};

export default function Main() {
  return (
    <div>
      <div className="flex h-[100vh] flex-col justify-between">
        {/* <div className="grotesk space-around mb-16 mt-6 flex flex-row items-center justify-between px-4 py-4 sm:mx-0 sm:mb-20 sm:px-0 md:px-6"> */}
        <div className="mt-4 flex flex-row justify-between self-stretch pb-4 pl-16 pt-6">
          <a
            href="/"
            className="flex align-middle text-3xl font-bold text-purple-700"
          >
            VolunTrack
          </a>
          <div className="flex hidden w-[25%] justify-between pl-14 md:flex md:w-[35%]">
            <a
              href="/"
              className="flex self-center align-middle text-xl text-black"
            >
              About
            </a>
            <a
              href="/"
              className="flex self-center align-middle text-xl text-black"
            >
              Contact Us
            </a>
          </div>
          {/* <BoGButton
              text="Log In"
              onClick={
              type="button"
              
              size="lg"
              outline
              pill
            /> */}
          <Button
            onClick={goToLogin}
            className="mr-16 flex bg-purple-700 align-middle hover:bg-purple-700"
            size="lg"
            outline
            pill
            type="button"
          >
            Log In
          </Button>
        </div>
        <div className="flex h-5/6 flex-row items-stretch justify-around">
          <div className="flex flex-col pt-4">
            <p className="w-fit self-center border-b-4 border-purple-700 text-3xl">
              Simplify Volunteer Coordination
            </p>
            <p className="border-purple-700 text-xl">
              Create your account to get started with our volunteer management
              system
            </p>
          </div>
          <div className="flex h-[100%] flex-col self-stretch">
            <img src={"/images/Landing Page Example.png"} className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* </div>
          <div className="flex items-center">
            <button className="pl-4 pr-12">
              <svg
                className="mr-auto inline-block text-black xl:hidden"
                width="33"
                height="50"
                viewBox="0 0 23 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.892578 10.8691H22.1058"
                  stroke="black"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
                <path
                  d="M0.892578 18.8691H22.1058"
                  stroke="black"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.1066 14.8688H0.893399"
                  stroke="black"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </>
      <div className="grotesk max-w-8xl mx-auto">
        <section className="w-full text-black">
          <div className="max-w-8xl mx-auto inline-block items-center p-3 pt-0 lg:flex lg:flex-wrap lg:pt-4">
            <div className="lg:w-3/6">
              <h2 className="inline-block max-w-xl text-3xl font-bold leading-none text-black lg:text-[4.2em]">
                Vel quis feugiat pharetra diam.
              </h2>

              <p className="mt-6 max-w-2xl text-xl font-semibold text-[#404040]">
                Lorem ipsum urna, consectetur adipiscing elit. Urna risus
                hendrerit dignissim duis fringilla sit. Lacus porttitor neque
                ipsum.
              </p>
            </div>
            <div className="mb-20 mt-44 hidden w-full flex-col lg:mt-12 lg:inline-block lg:w-3/6">
              <img src="/images/placeholder.png" alt="Hero" />
            </div>
            <div className="my-20 inline-block w-full flex-col lg:mt-0 lg:hidden lg:w-2/5">
              <img src="/images/placeholder.png" alt="image" />
            </div>
          </div>
          <div className="mt-0 bg-white lg:mt-40">
            <div className="mx-auto">
              <div className="mx-auto px-5 py-24 lg:px-24">
                <div className="my-10 flex w-full flex-col text-center">
                  <h2 className="mb-5 text-2xl font-bold text-black lg:text-3xl">
                    In ullamcorper magna nunc, non molestie augue feugiat eget.
                  </h2>
                </div>
                <div
                  className="
                  grid grid-cols-2
                  gap-16
                  text-center
                  lg:grid-cols-6"
                >
                  <div className="hidden items-center justify-center lg:inline-block">
                    <img
                      src="/images/segment.png"
                      alt="Segment"
                      className="block h-24 object-contain"
                    />
                  </div>
                  <div className="hidden items-center justify-center lg:inline-block">
                    <img
                      src="/images/segment.png"
                      alt="Segment"
                      className="block h-24 object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <img
                      src="/images/segment.png"
                      alt="Segment"
                      className="block h-24 object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <img
                      src="/images/segment.png"
                      alt="Segment"
                      className="block h-24 object-contain"
                    />
                  </div>
                  <div className="hidden items-center justify-center lg:inline-block">
                    <img
                      src="/images/segment.png"
                      alt="Segment"
                      className="block h-24 object-contain"
                    />
                  </div>
                  <div className="hidden items-center justify-center lg:inline-block">
                    <img
                      src="/images/segment.png"
                      alt="Segment"
                      className="block h-24 object-contain"
                    />
                  </div>
                </div>
                <div className="my-12 flex w-full flex-col pl-8 text-center">
                  <a
                    href="/"
                    className="
                    underline-blue
                    mb-8
                    mt-6
                    text-xl
                    font-bold
                    text-black
                  "
                  >
                    Ut eleifend.
                  </a>
                </div>
              </div>
            </div>
            <div className="text-black">
              <div
                className="
                max-w-9xl
                mx-auto
                flex
                flex-col
                items-center
                justify-center
                px-5
              "
              >
                <div className="mb-6 mr-0 w-full py-4 text-center lg:w-2/3">
                  <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                    Sem enim cursus orci at.
                  </h2>
                  <p className="mb-4 text-lg leading-relaxed">
                    In ullamcorper magna nunc, non molestie augue feugiat eget.
                    Mauris, vitae et, vitae et cursus amet tincidunt feugiat
                    nulla. Senectus maecenas diam risus sodales dictum eu. Eget
                    cursus sit bibendum pulvinar faucibus vitae nam sed.
                    Faucibus vel laoreet.
                  </p>
                  <a href="/" className="underline-blue font-semibold">
                    Learn more
                  </a>
                </div>
                <img
                  className="
                  lg:w-5/7
                  mb-40
                  hidden
                  w-5/6
                  rounded object-cover
                  object-center
                  lg:inline-block 
                  lg:w-4/6
                "
                  src="/images/placeholder.png"
                  alt="img"
                />

                <img
                  className="
                mb-24
                inline-block
                w-5/6
                rounded
                object-cover object-center
                lg:hidden
                lg:w-4/6 
              "
                  src="/images/placeholder.png"
                  alt="img"
                />
              </div>
            </div>
          </div>
          <div className="mx-auto px-5 pb-24 pt-32 lg:px-24">
            <div className="my-3 flex w-full flex-col text-left lg:text-center">
              <h2 className="bold mb-8 text-4xl font-bold leading-tight text-black lg:text-6xl">
                Lorem ipsum elit sit unar,{" "}
                <br className="hidden lg:inline-block" />
                consectetur adipiscing elit.
              </h2>
            </div>
            <div className="flex w-full flex-col text-left lg:text-center">
              <h3 className="text-2xl text-black">
                Lorem ipsum arcu, consectetur adipiscing elit. Viverra elementum
                pellentesque <br className="hidden lg:inline-block" />
                tortor, luctus blandit sed dolor et, semper. Posuere vitae
                vitae, ac mus. Arcu quis feugiat.
              </h3>
            </div>
            <div className="flex w-full flex-row justify-center pt-24 text-center">
              <a
                href="/"
                className="underline-blue px-8 text-xl font-semibold text-black"
              >
                Ut eleifend.
              </a>
              <a
                href="/"
                className="underline-gray px-6 text-xl font-semibold text-gray-700"
              >
                Tempus in.
              </a>
            </div>
          </div>
          <div className="invisible mx-auto flex max-w-6xl p-3 pb-32 lg:visible lg:px-2">
            <img src="/images/placeholder.png" alt="img" />
          </div>
          <div className="bg-white text-black">
            <div className="mx-auto flex flex-col items-center px-5 pt-56 lg:flex-row">
              <div className="mb-16 flex flex-col text-left lg:mb-0 lg:w-1/2 lg:flex-grow lg:items-start lg:pr-16 lg:pr-6">
                <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                  Bibendum tortor et sit convallis nec morbi.
                </h2>
                <p className="font-3xl mb-8 font-semibold leading-relaxed">
                  Lorem ipsum auctor sit amet, consectetur adipiscing elit. Sit
                  a egestas tortor viverra nisl, in non. Neque viverra
                  sollicitudin amet volutpat auctor amet. Aliquam pellentesque
                  condimentum mauris sit tincidunt egestas ullamcorper sit.{" "}
                </p>
              </div>
              <div className="lg:w-full lg:max-w-2xl">
                <img src="/images/placeholder.png" alt="img" />
              </div>
            </div>
            <div className="mt-32">
              <div className="mx-auto flex flex-col px-5 py-24 text-left lg:flex-row">
                <div className="hidden lg:inline-block lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
                <div className="flex flex-col pt-0 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-16 lg:pl-24 lg:pt-24">
                  <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                    Eu diam in magna blandit sit magna dolor proin velit.
                  </h2>
                  <p className="mb-8 font-semibold leading-relaxed text-black">
                    Lorem ipsum ac neque, consectetur adipiscing elit. Nibh
                    neque, ut purus donec sed donec semper ac vestibulum. Mi
                    urna, facilisis arcu, auctor elit. Ut nunc non aenean netus
                    ut.
                  </p>
                </div>
                <div className="inline-block lg:hidden lg:w-full lg:max-w-xl">
                  <img src="/images/placeholder.png" alt="img" />
                </div>
              </div>
            </div>
            <div className="my-24 p-4 text-black">
              <div className="max-w-9xl mx-auto flex flex-col items-center bg-gradient-to-r from-blue-200 to-blue-100 px-5 py-24 lg:flex-row">
                <div className="flex flex-col items-center pb-16 pl-0 text-center lg:mb-0 lg:w-1/2 lg:flex-grow lg:items-start lg:pl-12 lg:pr-24 lg:text-left">
                  <h2 className="pb-4 text-2xl font-bold leading-tight lg:text-4xl">
                    Lorem ipsum mi at amet, consecteturadipiscing elit. Mattis.
                  </h2>
                  <p className="text-md mb-8 lg:text-xl">
                    Lorem ipsum praesent amet, consectetur adipiscing elit.
                    Cursus ullamcorper id tristique tincidunt. Tincidunt feugiat
                    at mi feugiat hendrerit. Ac faucibus accumsan, quis lacus,
                    lectus eget bibendum. At praesent quisque sollicitudin
                    fusce.
                  </p>
                </div>
                <div className="w-4/7 pr-12 lg:w-2/5">
                  <img
                    src="/images/placeholder.png"
                    className="hidden object-cover object-center lg:inline-block"
                    alt="image"
                  />
                  <img
                    src="/images/placeholder.png"
                    className="inline-block object-cover object-center lg:hidden"
                    alt="image"
                  />
                </div>
              </div>
            </div>
            <div className="mx-auto">
              <div className="max-w-8xl mx-auto px-5 py-24 lg:px-24">
                <div className="my-6 flex w-full flex-col text-left lg:text-center">
                  <h3 className="mb-8 text-5xl font-bold text-black">
                    Dui tellus quis magna id ultricies eu sed.
                  </h3>
                  <h3 className="mb-12 px-0 text-lg font-semibold text-gray-900 lg:px-52">
                    Lorem ipsum accumsan arcu, consectetur adipiscing elit.
                    Aliquet vestibulum molestie amet, maecenas id amet. Ipsum
                    accumsan arcu, aenean viverra penatibus quis. Laoreet.
                  </h3>
                </div>
                <img src="/images/placeholder.png" alt="img" />
              </div>
            </div>
            <div className="text-black">
              <div className="max-w-8xl mx-auto flex flex-col px-5 py-48 text-black lg:flex-row">
                <div className="lg:mb-0 lg:w-full lg:max-w-xl">
                  <img
                    className="rounded object-cover object-center"
                    alt="image"
                    src="/images/placeholder1.png"
                  />
                </div>
                <div className="items-left flex flex-col pt-16 text-left lg:w-1/2 lg:flex-grow lg:items-start lg:pl-32 lg:pl-48 lg:text-left">
                  <h2 className="mb-2 text-lg leading-tight text-gray-700 sm:text-lg">
                    Viverra enim diam gravida risus nisl.
                  </h2>
                  <h2 className="mb-6 text-lg font-bold sm:text-lg">
                    Lectus eu.
                  </h2>
                  <h2 className="mb-4 text-3xl font-bold sm:text-3xl">
                    Lorem ipsum accumsan arcu, consectetur adipiscing elit. Sed
                    eget enim vel.
                  </h2>
                  <a
                    href="/"
                    className="underline-blue mt-12 text-lg font-bold leading-relaxed"
                  >
                    Ut convallis massa.
                  </a>
                </div>
              </div>
            </div> */
}
{
  /* </div>
        </section> */
}
{
  /* </div> */
}
