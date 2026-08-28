import { useState, useCallback, memo } from "react";
import GeneralInput from "@/components/GeneralInput";
import Slogn from "@/components/Slogn";
import ChatView from "@/components/ChatView";
import { productList, defaultProduct } from "@/utils/constants";
import { Tabs } from "antd";

type HomeProps = Record<string, never>;

const Home: React.FC<HomeProps> = memo(() => {
  const [inputInfo, setInputInfo] = useState<CHAT.TInputInfo>({
    message: "",
    deepThink: false,
  });
  const [product, setProduct] = useState(defaultProduct);

  const changeInputInfo = useCallback((info: CHAT.TInputInfo) => {
    setInputInfo(info);
  }, []);

  const renderContent = () => {
    if (inputInfo.message.length === 0) {
      return (
        <div className="flex flex-col items-center w-full max-w-7xl mx-auto pt-20 bg-white">
          <div className="mb-8 text-3xl font-bold text-gray-800">
            <Slogn />
          </div>
          <Tabs
            activeKey={product.type}
            onChange={(key) => setProduct(productList.find((p) => p.type === key) || defaultProduct)}
            items={productList.map((item) => ({
              key: item.type,
              label: (
                <div className="flex items-center">
                  <i className={`font_family ${item.img} mr-2 text-teal-500`}></i>
                  {item.name}
                </div>
              ),
            }))}
            className="mb-6 w-3/4"
            centered
          />
          <div className="w-3/4 max-w-2xl rounded-2xl shadow-lg bg-white p-4">
            <GeneralInput
              placeholder={product.placeholder}
              showBtn={true}
              size="big"
              disabled={false}
              product={product}
              send={changeInputInfo}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="flex w-full h-full">
        <div className="w-1/4 bg-white p-6 border-r border-gray-200">
          <div className="flex items-center mb-4">
            <i className={`font_family ${product.img} mr-2 text-teal-500 text-2xl`}></i>
            <span>{product.name}</span>
          </div>
          <Tabs
            activeKey={product.type}
            onChange={(key) => setProduct(productList.find((p) => p.type === key) || defaultProduct)}
            items={productList.map((item) => ({
              key: item.type,
              label: item.name,
            }))}
            tabPosition="left"
          />
        </div>
        <div className="w-3/4 p-8">
          <ChatView inputInfo={inputInfo} product={product} />
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-auto">
      {renderContent()}
    </div>
  );
});

Home.displayName = "Home";

export default Home;