const showImg = document.getElementById("image_show");
const message = document.getElementById("result-text");

document
  .getElementById("imageInput")
  .addEventListener("change", function (event) {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      const render = new FileReader();

      render.onload = function (e) {
        message.innerText = "";
        const base64Image = e.target.result;
        showImg.src = "./loading.gif";

        axios({
          method: "POST",
          url: "https://detect.roboflow.com/waste-segregation-sqe9y/1",
          params: {
            api_key: "El2aIBbO64HqJR7jdx6K",
          },
          data: base64Image,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
          .then(function (response) {
            showImg.src = base64Image;

            const data = response.data;

            if (data.predictions.length > 0) {
              // Extract class names and filter out duplicates
              const uniqueClasses = [...new Set(data.predictions.map(prediction => prediction.class))];
              message.innerText = uniqueClasses.join(', '); // Display the unique classes
            } else {
              message.innerText = "No predictions found";
            }
            console.log(data);
          })
          .catch(function (error) {
            console.log(error.message);
          });
      };

      render.readAsDataURL(selectedFile);
    }
  });
