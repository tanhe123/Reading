package net.xiayule.reading.utils;

import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;

/**
 * Created by tan on 15-3-22.
 */
public class JsonUtils {
    private static ObjectMapper objectMapper = new ObjectMapper();

    public static String toJson(Object obj) throws IOException {
        String json = objectMapper.writeValueAsString(obj);
        return json;
    }
}
