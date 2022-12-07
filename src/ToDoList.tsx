import { useForm } from "react-hook-form";

interface IFormData {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  passwordConfirm: string;
  extraError?: string;
}

function ToDoList() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<IFormData>({
    defaultValues: {
      email: "@naver.com",
    },
  });
  const onValid = (data: IFormData) => {
    if (data.password !== data.passwordConfirm) {
      setError(
        "passwordConfirm",
        { message: "Password is not the same" },
        { shouldFocus: true }
      );
    }
    setError("extraError", { message: "Server Error" });
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onValid)}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver.com$/,
              message: "Email can only Naver Email",
            },
            minLength: { value: 10, message: "Your Email is too short" },
          })}
          placeholder="Email"
        />
        <span>{errors?.email?.message}</span>
        <input
          {...register("firstName", {
            required: "FristName is required",
            validate: {
              noNico: (value) =>
                value.includes("nico") ? "no nicos allowed" : true,
              noNick: (value) =>
                value.includes("nick") ? "no nick allowed" : true,
            },
          })}
          placeholder="Frist Name"
        />
        <span>{errors?.firstName?.message}</span>
        <input
          {...register("lastName", { required: "LastName is required" })}
          placeholder="LastName"
        />
        <span>{errors?.lastName?.message}</span>
        <input
          {...register("userName", { required: "UserName is required" })}
          placeholder="UserName"
        />
        <span>{errors?.userName?.message}</span>
        <input
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
        />
        <span>{errors?.password?.message}</span>
        <input
          {...register("passwordConfirm", {
            required: "PasswordConfirm is required",
          })}
          placeholder="PasswordConfirm"
        />
        <span>{errors?.passwordConfirm?.message}</span>
        <button>Add</button>
        <span>{errors?.extraError?.message}</span>
      </form>
    </div>
  );
}

export default ToDoList;
