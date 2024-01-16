import React, { useEffect, useRef, useState } from "react";
import GerbLogo from "../assets/gerb.png";
import Header from "../components/Header";
import ImageCard2 from "../assets/buti2.jpg";
import Category from "../components/Category";
import {
  Category as CategoryType,
  getItemsById,
  getData,
  getItemById,
  Place,
  Route,
  URL_SERVER,
  URL_SITE,
} from "../utils/backend";
import { declOfHours, getImage } from "../utils/utils";
import { useNavigate, useParams } from "react-router-dom";
import PlaceItem from "../components/PlaceItem";
import { Placemark, YMaps, Map } from "@pbe/react-yandex-maps";
import { YMapsApi } from "@pbe/react-yandex-maps/typings/util/typing";
import { QRCode } from "react-qrcode-logo";
import {
  EmailShareButton,
  FacebookShareButton,
  GabShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKIcon,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberIcon,
  ViberShareButton,
  VKIcon,
  VKShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";

function PlacePage({ route }: { route?: boolean }) {
  const [data, setData] = useState<any>(null);
  const [points, setPoints] = useState<Place[]>([]);
  const map = useRef<any>(null);
  const [yamap, setYampas] = useState<YMapsApi | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { id } = useParams();
  const [offset, setOffset] = useState(3);
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const linkInput = document.getElementById("link-input") as HTMLInputElement;
    linkInput.select();
    document.execCommand("copy");
    setCopied(true);
  };


  async function loadPlaces() {
    try {
      const data: any = await getItemById(
        id || "1",
        route ? "routes" : "places"
      );
      console.log("set data", data, route ? "routes" : "places");

      if (data) {
        if (data?.points) {
          // const result = await getItemsById(data?.points?.split(','), 'places');
          setPoints(data?.points);
        } else {
          const places_all = (await getData("places")) as Place[];
          console.log("places alll", places_all);
          setPoints(places_all);
        }
        console.log("set data", data);
        setData(data);


        if (yamap && !data?.points) {
          setTimeout(() => loadPoints(yamap, data), 1200);
        }
      }
    } catch (err) {
      navigate("/");
    }
  }

  useEffect(() => {
    loadPlaces();
    window.scrollTo(0, 0);
    console.log('update id', id)
  }, [id]);

  const addRoute = (ymaps: any) => {
    setYampas(ymaps);
    console.log("loaded ymaps::", points);
    if (points) {
      console.log("points add obne time wisn now");
      if (data?.points) {
        setTimeout(() => loadRouters(data?.points, ymaps), 1200);
      }
    }
  };

  function loadPoints(yamap: YMapsApi, data: any) {
    if (yamap == null) return;
    console.log('update coordL::::::::::::::::::::::::::::::::::::', data?.coordinates)
    map.current.geoObjects.removeAll()
    const placemark = new yamap.Placemark(data?.coordinates?.split(","),
      {
      },
      {
        iconColor: "red"
      }
    );

    const res = map?.current.geoObjects?.add(placemark);

    // placemark.events.fire('click', {
    //   position: data?.coordinates.split(",")
    // });

    console.log("RESULTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", res);
    setLoaded(true);
  }

  function loadRouters(points: any[], yamap?: YMapsApi) {
    if (yamap == null) return;
    console.log("loadddsadedse");
    const extractedCoordinates: any[] = points.map((item) => item?.coordinates);
    //console.log(extractedCoordinates)
    const multiRoute = new yamap.multiRouter.MultiRoute(
      {
        referencePoints: extractedCoordinates,
        // params: {
        //     routingMode: "masstransit"
        // }
      } as any,
      {
        boundsAutoApply: true,
        routeActiveStrokeWidth: 6,
        routeActiveStrokeColor: "#fa6600",
      }
    );
    console.log("multiRoute", multiRoute);

    const res = map?.current.geoObjects?.add(multiRoute);
    console.log("trwsugoil", res);
    setLoaded(true);
  }

  // useEffect(() => {
  //   if (points.length > 0) {
  //     setTimeout(()=>loadRouters(), 200)
  //   }
  // }, [points])

  if (data == null) {
    return (
      <div className="min-h-screen w-screen flex justify-center items-center">
        <div className="w-full px-[5%] flex justify-center items-center h-[20em]">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen min-h-screen bg-[#FFFAF1]">
      <Header />
      <section className="px-[5%]">
        <div
          className="w-full min-h-[400px] bg-shadow-g relative"
          style={{
            backgroundImage: `url(${getImage(data?.images)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 26,
          }}
        >
          <div className="px-[5%] py-[20px] h-full w-full flex z-[100] flex flex-col absolute">
            <h2 className="text-white font-bold spacing-[0px] text-3xl mt-auto">
              {data.name}
            </h2>
            <h3 className="text-white spacing-[0px] text-lg mt-1">
              {data.card_description}
            </h3>
          </div>
        </div>
        <div className="mt-[30px] gap-x-[10px] flex flex-row">
          {data?.category &&
            data?.category?.map((item: any) => (
              <Category
                text={item?.name}
                description={item?.description}
                color={"bg-[#D2F881]"}
              />
            ))}
        </div>
      </section>
      <section
        className={
          "px-[5%] flex max-md:flex-col md:flex-row mt-[30px] items-stretch"
        }
      >
        <div
          className={`w-full md:w-[70%] bg-white rounded-[50px] h-auto px-[36px] py-[30px]`}
        >
          <p className="text-xl mb-[30px] leading-[150%]">
            {data?.description}
          </p>

          {data?.time ? (
            <h3 className="text-xl text-[#2C2C2C] mb-[15px] leading-[150%]">
              Продолжительность: {data?.time} {declOfHours(data.time)}
            </h3>
          ) : (
            <></>
          )}
          {data?.points ? (
            <>
              <h3 className="text-xl text-[#2C2C2C] mb-[15px] leading-[150%]">
                Точек: {data?.points?.length}
              </h3>
              <h3 className="text-xl text-[#2C2C2C] mb-[30px] leading-[150%]">
                Города:{" "}
                {data?.points
                  ?.map((item: any) => item?.city)
                  .filter(
                    (value: any, index: any, self: any) =>
                      self.indexOf(value) === index
                  )
                  .join(", ")}
              </h3>
            </>
          ) : (
            <></>
          )}

          <YMaps query={{ apikey: "dd278cf2-bbc1-4819-8232-fbba0d13289a" }}>
            <Map
              instanceRef={map}
              className="w-full h-[500px] rounded-lg"
              onLoad={addRoute}
              modules={["multiRouter.MultiRoute"]}
              defaultState={{ center: [53.2415041, 50.2212463], zoom: 7 }}
            >
              {data?.points ? (
                points &&
                points.length > 0 &&
                points.map((point) => {
                  if (point?.coordinates?.split(",").length == 2) {
                    return (
                      <Placemark
                        options={{
                          iconColor: "red",
                        }}
                        defaultGeometry={point?.coordinates?.split(",")}
                      />
                    );
                  }
                })
              ) : (
                <Placemark
                  options={{
                    iconColor: "red",
                  }}
                  defaultGeometry={data?.coordinates?.split(",")}
                />
              )}
            </Map>
          </YMaps>

          <div className="mt-4 flex max-md:flex-col min-md:flex-row">
            <div className="max-md:mx-auto">
              <QRCode
                logoImage={GerbLogo}
                eyeRadius={[
                  { // top/left eye 
                    outer: [30, 20, 0, 31],
                    inner: [50, 50, 50, 50],
                  },
                  { // top/right eye 
                    outer: [36, 36, 39, 0],
                    inner: [50, 50, 50, 50],
                  },
                  { // bottom eye 
                    outer: [33, 0, 34, 34],
                    inner: [50, 50, 50, 50],
                  }
                ]}
                value={
                  URL_SITE + "/" + (data?.points ? "route" : "place") + "/" + id
                }
                logoHeight={50}
                logoWidth={50}
                size={225}
                removeQrCodeBehindLogo={true}
                qrStyle={"squares"}
                logoPadding={0}
                quietZone={34}
                ecLevel={"M"}
                enableCORS={false}
                logoPaddingStyle={"square"}
                logoOpacity={1}
              />
            </div>
            <div className="my-auto">
              <h1 className="mb-2 font-medium text-lg">Поделитесь этой ссылкой через</h1>
              <div className="gap-x-2 flex">
                <VKShareButton
                  url={String(window.location)}
                  image={getImage(data?.images)}
                  title={data?.name}
                  content={data?.description}
                >
                  <VKIcon size={32} round />
                </VKShareButton>
                <TelegramShareButton
                  url={String(window.location)}
                  title={data?.name}
                >
                  <TelegramIcon size={32} round />
                </TelegramShareButton>
                <WhatsappShareButton
                  url={String(window.location)}
                  title={data?.name}
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <OKShareButton
                  url={String(window.location)}
                  image={getImage(data?.images)}
                  title={data?.name}
                >
                  <OKIcon size={32} round />
                </OKShareButton>
                <ViberShareButton
                  url={String(window.location)}
                  title={data?.name}
                >
                  <ViberIcon size={32} round />
                </ViberShareButton>
              </div>
              <h1 className="font-medium text-lg mt-4">Или скопируйте ссылку</h1>
              <div className="border-2 border-gray-200 flex justify-between items-center mt-2 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-gray-500 ml-2"
                >
                  <path
                    d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"
                  ></path>
                  <path
                    d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"
                  ></path>
                </svg>

                <input id="link-input" className="w-full outline-none bg-transparent mx-4" type="text" placeholder="link" value={String(window.location)} />
                <button onClick={handleCopy} className="bg-[#C8EC7B] text-[#2C2C2C] rounded text-sm py-2 px-5 mr-4 hover:bg-[#dafb93]">
                  {copied ? "Скопировано" : "Скопировать"}
                </button>
              </div>

            </div>
          </div>
        </div>
        <div className="md:w-[30%] max-md:mt-[20px] md:ml-[20px] gap-[20px] flex flex-col">
          <h1 className="text-2xl font-medium text-[#2C2C2C]">
            {data?.points ? "Все точки маршрута" : "Другие места"}
          </h1>
          {points?.slice(0, offset).map((item: any) => {
            return <PlaceItem data={item} />;
          })}
          {offset < points.length && (
            <button
              className="border border-[#595959] w-[200px] bg-[#FFFDFB] rounded-xl py-[10px] mx-auto"
              onClick={() => {
                setOffset(offset + 3);
              }}
            >
              Раскрыть →
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default PlacePage;
