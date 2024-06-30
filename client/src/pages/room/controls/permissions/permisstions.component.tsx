import { Button } from "@mui/material";
import { PermissionRequestEvent, useCall } from "@stream-io/video-react-sdk";
import { useCallback, useEffect, useState } from "react";

const PermissionsRequest = () => {
  const [permissionRequest, setPermissionRequest] = useState<
    PermissionRequestEvent[]
  >([]);
  const call = useCall();

  useEffect(() => {
    return call?.on("call.permission_request", (event) => {
      setPermissionRequest((req) => [...req, event]);
    });
  }, [call]);

  const handlePermissionRequest = useCallback(
    async (request: PermissionRequestEvent, accept: boolean) => {
      const { user, permissions } = request;
      try {
        if (accept) {
          call?.grantPermissions(user.id, permissions);
        } else {
          call?.revokePermissions(user.id, permissions);
        }

        setPermissionRequest((req) => req.filter((each) => each != request));
      } catch (e) {
        console.log("Error", e);
      }
    },
    [call]
  );

  if (!permissionRequest.length) return <></>;

  return (
    <div>
      {permissionRequest.map((request) => {
        return (
          <div key={request.user.id} className="permissions-container">
            <h5>
              {request.user.name} requested to {request.permissions.join(", ")}
            </h5>
            <div className="btn-container">
              <Button
                variant="outlined"
                color="success"
                onClick={() => handlePermissionRequest(request, true)}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handlePermissionRequest(request, false)}
              >
                Deny
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionsRequest;
