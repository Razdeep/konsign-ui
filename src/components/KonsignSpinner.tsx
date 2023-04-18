import { TailSpin } from "react-loader-spinner"

export const KonsignSpinner: React.FC = () => {
    return <TailSpin
        height="50"
        width="50"
        color="#0A4D68"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
    />
}