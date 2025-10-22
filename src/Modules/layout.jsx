import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header className=" px-4 flex items-center  bg-primary h-[75px]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-[200px] cursor-pointer text-white">
              <LeftOutlined  style={{ strokeWidth: 2 }} />{" "}
              <div className="font-medium text-base">View Audience</div>
              
            </div>
          </div>
        </Header>
        <Layout
          style={{
            height: "calc(100vh - 82px - 20px )",
            overflow: "auto",
            padding: 14,
            backgroundColor: "white",
          }}
        >
          <Content>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
