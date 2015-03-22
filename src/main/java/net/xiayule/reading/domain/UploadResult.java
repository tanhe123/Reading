package net.xiayule.reading.domain;

/**
 * Created by tan on 15-3-22.
 */
public class UploadResult {
    private Integer success;
    private String message;

    public UploadResult(Integer success, String message) {
        this.success = success;
        this.message = message;
    }

    public Integer getSuccess() {
        return success;
    }

    public void setSuccess(Integer success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
