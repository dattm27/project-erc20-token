import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { saveContract } from "../scripts/utils"; // Giả sử bạn có hàm saveContract để lưu thông tin contract
import * as dotenv from "dotenv";
dotenv.config();

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();


    const data = await deploy("TappToken", {
        from: deployer,
        args: [], // Không có đối số cho constructor
        log: true,
        deterministicDeployment: false,
    });

    console.log("TappToken deployed to:", data.address);
    
    // Lưu địa chỉ contract
    await saveContract(network.name, "TappToken", data.address, data.implementation!);

    // Kiểm tra và verify contract trên Etherscan (nếu cần)
    try {
        await hre.run("verify:verify", {
            address: data.address,
            constructorArguments: [],
        });
    } catch (e) {
        console.log("Verification failed:", e);
    }
};

// Gán tag cho deploy script
deploy.tags = ["TappToken"];
export default deploy;
