import * as React from "react";

export const ErrorMessage: React.FC<{ children?: any }> = ({ children }) => {
    return (
      <small className="text-red-700">
        {children}
      </small>
    );
  };
