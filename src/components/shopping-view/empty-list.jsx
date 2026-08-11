import React from "react";
import { Button } from "../ui/button";

function EmptyList({ icon: Icon, title, description, buttonText, onClick }) {
  return (
    <div className="text-center py-20 rounded-lg shadow-sm border border-border">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-4">
        {Icon && <Icon className="w-8 h-8 fill-current" />}
      </div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {description && (
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          {description}
        </p>
      )}
      <Button onClick={onClick} variant="secondary" className="shadow-sm">
        {buttonText}
      </Button>
    </div>
  );
}

export default EmptyList;
