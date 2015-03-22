package net.xiayule.reading.domain;

/**
 * Created by tan on 15-3-22.
 */
public class UploadResult {
    private Integer success;
    private String message;
    private String url;

    public UploadResult(Integer success, String url, String message) {
        this.success = success;
        this.url = "http://localhost:8080/image?img=" + url;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
