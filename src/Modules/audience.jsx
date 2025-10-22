import { Button, Divider, Drawer, Form, Input, Select, Space } from "antd";
import { useState } from "react";
import { LeftOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

const ViewAudience = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [updateKey, setUpdateKey] = useState(0);
  const [submittedPayload, setSubmittedPayload] = useState(null);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const WEBHOOK_URL =
    "https://webhook.site/4f148bae-4c9d-49b1-94e5-ac973fb6ece1";
  const schemaOptions = [
    { id: 1, label: "First Name", value: "first_name", traits: "user" },
    { id: 2, label: "Last Name", value: "last_name", traits: "user" },
    { id: 3, label: "Gender", value: "gender", traits: "user" },
    { id: 4, label: "Age", value: "age", traits: "group" },
    { id: 5, label: "Account Name", value: "account_name", traits: "group" },
    { id: 6, label: "City", value: "city", traits: "group" },
    { id: 7, label: "State", value: "state", traits: "group" },
  ];

  const hoverUnderLineEffect =
    "relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:w-full after:scale-x-0 after:bg-primary after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 hover:text-primary";

  const getAvailableOptions = (currentIndex) => {
    const selectedValues =
      form.getFieldValue("schema")?.map((s) => s?.sub_schema) || [];
    const currentValue = form.getFieldValue([
      "schema",
      currentIndex,
      "sub_schema",
    ]);
    return schemaOptions.filter(
      (option) =>
        !selectedValues.includes(option.value) || option.value === currentValue
    );
  };
  const onFinish = async (values) => {
    const payload = {
      segment_name: values.segment_name,
      schema: (values.schema || []).map((item) => {
        const selectedOption = schemaOptions.find(
          (s) => s.value === item.sub_schema
        );
        return selectedOption
          ? { [selectedOption.value]: selectedOption.label }
          : {};
      }),
    };

    setSubmittedPayload(payload);

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "no-cors",
      });
      console.log("Payload sent to webhook successfully!");
    } catch (error) {
      console.error("Error sending payload to webhook:", error);
    }

    setTimeout(() => {
      setSubmittedPayload(null);
    }, 6000);

    form.resetFields();
    setOpen(false);
  };
  const handleClose = () => {
    form.resetFields();
    setOpen(false);
  };
  return (
    <>
      <Button onClick={showDrawer} className="min-w-[20vw]">
        Save Segment
      </Button>
      {submittedPayload && (
        <div className="p-4 mt-4 bg-gray-100 border rounded">
          <pre>{JSON.stringify(submittedPayload, null, 2)}</pre>
        </div>
      )}
      <Drawer
        title="Saving Segment"
        closable
        onClose={handleClose}
        size="default"
        open={open}
        headerStyle={{
          backgroundColor: "#11bf9c",
          color: "#fff",
          minHeight: "75px",
        }}
        closeIcon={<LeftOutlined style={{ color: "#fff", strokeWidth: 2 }} />}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="flex flex-col h-full justify-between"
        >
          <div>
            <Form.Item
              label="Enter the Name of the Segment"
              name="segment_name"
              rules={[
                { required: true, message: "Please enter the segment name" },
              ]}
            >
              <Input placeholder="Name of the segment" />
            </Form.Item>

            <p>
              To save your segment, you need to add the schemas to build the
              query
            </p>

            <div className="mb-6 flex justify-end my-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                - User Traits
              </span>
              <span className="flex items-center gap-2 ml-4">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                - Group Traits
              </span>
            </div>

            <Form.List name="schema">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => {
                    const selectedValue = form.getFieldValue([
                      "schema",
                      name,
                      "sub_schema",
                    ]);
                    const trait = schemaOptions.find(
                      (s) => s.value === selectedValue
                    )?.traits;
                    const dotColor =
                      trait === "user"
                        ? "bg-green-500"
                        : trait === "group"
                        ? "bg-red-500"
                        : "bg-gray-300";

                    return (
                      <Space key={key} align="baseline" className="mb-2 w-full">
                        <div className="flex items-center mb-2 gap-6">
                          <div className="flex-shrink-0">
                            <span
                              className={`w-3 h-3 rounded-full inline-block ${dotColor}`}
                            ></span>
                          </div>

                          <div className="flex-1">
                            <Form.Item
                              {...restField}
                              name={[name, "sub_schema"]}
                              rules={[
                                { required: true, message: "Missing schema" },
                              ]}
                              className="mb-0 w-full"
                            >
                              <Select
                                placeholder="Add schema to segment"
                                className="w-full"
                                onChange={() =>
                                  setUpdateKey((prev) => prev + 1)
                                }
                              >
                                {getAvailableOptions(name).map((dt) => (
                                  <Option value={dt.value} key={dt.id}>
                                    {dt.label}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>

                          <div
                            className="bg-primary cursor-pointer text-white px-2 rounded flex-shrink-0"
                            onClick={() => remove(name)}
                          >
                            <MinusOutlined />
                          </div>
                        </div>
                      </Space>
                    );
                  })}

                  <Form.Item>
                    <Button
                      type="link"
                      className={`!text-primary ${hoverUnderLineEffect} !px-0 leading-tight`}
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      {" "}
                      Add new schema
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </div>

          <div>
            <Divider />

            <Form.Item className=" w-full">
              <div className="flex gap-2">
                <Button type="primary" htmlType="submit">
                  Save the Segment
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    onClose();
                  }}
                  danger
                >
                  Cancel
                </Button>
              </div>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default ViewAudience;
