import FormInput from "./FormInput";

const AuthFieldList = ({ fields, register }) => {
    return fields.map((field) => (
        <FormInput
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            register={register}
        />
    ));
};

export default AuthFieldList;
